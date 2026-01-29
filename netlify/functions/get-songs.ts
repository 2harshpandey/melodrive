
import { Handler } from '@netlify/functions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});

const handler: Handler = async (event, context) => {
  const tag = event.queryStringParameters?.tag;

  if (!tag) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Tag parameter is required' }),
    };
  }

  try {
    const { resources } = await cloudinary.search
      .expression(`tags=${tag}`)
      .sort_by('public_id', 'desc')
      .execute();

    const songs = resources.map((file: any) => ({
      url: file.secure_url,
      title: file.filename,
      artist: file.context?.custom?.artist || 'Unknown Artist',
      albumArt: file.context?.custom?.albumArt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(songs),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching songs from Cloudinary' }),
    };
  }
};

export { handler };
