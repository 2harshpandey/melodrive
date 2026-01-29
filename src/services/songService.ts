
import axios from 'axios';

const getSongs = async (tag: string) => {
  const response = await axios.get(`/api/get-songs?tag=${tag}`);
  return response.data;
};

export { getSongs };
