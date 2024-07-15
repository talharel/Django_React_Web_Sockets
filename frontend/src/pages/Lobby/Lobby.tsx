import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TypeCodeBlock } from '../../utils/type';
import { capitalize } from '../../utils/utils';
import codeblockService from '../../services/codeblockService';
import './Lobby.css';

function Lobby() {
  const [codeBlocks, setCodeBlocks] = useState<TypeCodeBlock[]>([]);

  useEffect(() => {
    async function fetchCodeblocks() {
      try {
        const codeBlocksData = await codeblockService.getCodeblocks();
        setCodeBlocks(codeBlocksData);
      } catch (error) {
        console.error('Error fetching codeblocks:', error);
      }
    }
    
    fetchCodeblocks();
  }, []);


  return (
    <div className='lobby-container'>
      <h1 className='title'>Choose Code Block</h1>
      <ul className='code-block-list'>
        {codeBlocks.map((block) => (
          <li key={block.id}>
            <Link to={`/codeblock/${block.id}`} className='code-block-link'>
              {capitalize(block.title)} case
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Lobby;
