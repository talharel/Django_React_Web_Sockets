import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TypeCodeBlock } from '../../utils/type';
import { capitalize } from '../../utils/utils';
import smily from '../../assets/images/smily.jpg';
import AceEditor from 'react-ace';
import 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import codeblockService from '../../services/codeblockService';
import './CodeBlock.css';
import { backendDomainAndPort } from '../../utils/constants';

function CodeBlock() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [codeBlock, setCodeBlock] = useState<TypeCodeBlock | null>(null);
  const [role, setRole] = useState<string>('student');
  const [userCount, setUserCount] = useState(0);
  const [caseSolved, setCaseSolved] = useState<boolean>(false);
  const [currentCode, setCurrentCode] = useState<string>('');
  const socketRef = useRef<WebSocket | null>(null);
  const pendingMessagesRef = useRef<string[]>([]);

  useEffect(() => {
    async function fetchCodeblocks() {
      try {
        const codeBlockData = await codeblockService.getCodeblocksById(
          Number(id)
        );
        setCodeBlock(codeBlockData);
        setCurrentCode(codeBlockData.template);
      } catch (error) {
        console.error('Error fetching codeblocks:', error);
      }
    }

    fetchCodeblocks();
  }, [id]);

  useEffect(() => {
    const socket = new WebSocket(`ws://${backendDomainAndPort}/ws/chat/${id}/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket Client Connected');
      // Send any pending messages
      pendingMessagesRef.current.forEach((message) => socket.send(message));
      pendingMessagesRef.current = [];
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.user_message !== undefined) {
        setCurrentCode(message.user_message)
      }

      if (message.success_message != undefined){
          setCaseSolved(true)
      }

      if (message.user_count !== undefined) {
        setUserCount(message.user_count);
      }

      if (message.user_count === 1) {
        setRole('teacher');
        socket.send('close');
      }

      if (message.message === 'close') {
        goToLobby();
      }

    };

    socket.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };

    return () => {
      socket.close();
    };
  }, [id]);

  const handleCodeChange = (newCode: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(newCode);
    } 

    if (newCode === codeBlock!.solution) {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send('success');
      } 
    }

    setCurrentCode(newCode);
  };

  const printSolution = () => {
    console.log(codeBlock?.solution);
  };

  const goToLobby = () => {
    navigate('/');
  };

  return (
    <div className='codeblock-container'>
      {codeBlock ? (
        <>
          <button className='CodeBlockButton' onClick={goToLobby}>
            Go to the Lobby
          </button>
          <h1>{capitalize(codeBlock.title)} case</h1>
          <h4>Role: {role}</h4>
          <h4>{codeBlock.Content}</h4>
          <h4>Users in the room: {userCount}</h4>
          <button className='printSolutionButton' onClick={printSolution}>
            Click to see the solution in the console
          </button>

          {caseSolved && (
            <div style={{ width: '200px' }}>
              <img
                src={smily}
                alt='Smiley'
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          )}

          <AceEditor
            style={{
              height: '200px',
              width: '100%',
            }}
            placeholder='Start Coding'
            readOnly={role === 'teacher'}
            mode='javascript'
            theme='monokai'
            name='basic-code-editor'
            onChange={handleCodeChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={currentCode}
            setOptions={{
              useWorker: false,
            }}
          />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default CodeBlock;
