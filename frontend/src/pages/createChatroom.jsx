import { useState } from 'react';
import axios from 'axios';

const CreateChatroom = () => {
  const [chatroomName, setChatroomName] = useState('');
  const [createdChatroom, setCreatedChatroom] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setChatroomName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/chatrooms', {
        name: chatroomName,
      });

      setCreatedChatroom(response.data);
      setError(null);
      setChatroomName('');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error creating chatroom.');
      }
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create a Chatroom</h2>
      {error && <p>{error}</p>}
      {createdChatroom && (
        <p>
          Chatroom created with secret key: {createdChatroom.token}, Name: {createdChatroom.name}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter chatroom name"
          value={chatroomName}
          onChange={handleInputChange}
        />
        <button type="submit">Create Chatroom</button>
      </form>
    </div>
  );
};

export default CreateChatroom;
