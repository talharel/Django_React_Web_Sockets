from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class ChatConsumer(WebsocketConsumer):
    rooms = {}  # Dictionary to store room IDs and user counts


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.last_message = None

    def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['id']
        self.group_name = f'chat_{self.room_id}'
        
        # Add the user to the room's group
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()

        # Update the user count for the room
        self.update_user_count(1)  # Increment user count
    
    def disconnect(self,close_code):
        # Remove the user from the room's group
    
        
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

        if self.last_message == 'close': # teacher exit the room
            async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'redirect_user', # redirect_user is the function below
                'message': 'close' # message is the parameter
            }
        )

        # Update the user count for the room
        self.update_user_count(-1)  # Decrement user count


    def redirect_user(self, event):
    # Handler for receiving user count updates
        message = event['message']

        # Send user count to the WebSocket connection
        self.send(text_data=json.dumps({
            'message': message
        }))



    
    def receive(self, text_data):

        if text_data == 'close':
            self.last_message = text_data
            return


        if text_data == 'success':
            async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_success_message', # send_success_message is the function below
                'success_message': 'success' # success_message is the parameter
            }
        )

        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'send_user_message',
                'user_message': text_data
            }
        )

    def send_success_message(self,event):
        message = event['success_message']

        self.send(text_data=json.dumps({
            'success_message': message
        }))
    

    def send_user_message(self,event):
        message = event['user_message']

        # Send user count to the WebSocket connection
        self.send(text_data=json.dumps({
            'user_message': message
        }))

    

    def update_user_count(self, delta):
        if self.room_id in self.rooms:
            self.rooms[self.room_id] += delta
        else:
            self.rooms[self.room_id] = 1  # Initialize count if room not in dictionary

        print(f"Room {self.room_id} user count: {self.rooms[self.room_id]}")

        # Broadcast the updated user count to all clients in the room
        self.send_user_count()

    def send_user_count(self):
        # Broadcast the updated user count to all clients in the room
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                'type': 'user_count',
                'count': self.rooms[self.room_id]
            }
        )

    def user_count(self, event):
        # Handler for receiving user count updates
        count = event['count']

        # Send user count to the WebSocket connection
        self.send(text_data=json.dumps({
            'user_count': count
        }))


    


