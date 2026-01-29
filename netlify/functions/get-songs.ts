import { Handler } from '@netlify/functions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handler: Handler = async (event, context) => {
  console.log('Received request to get-songs function');
  const tag = event.queryStringParameters?.tag;
  console.log('Fetching songs for tag:', tag);
  console.log('Cloudinary Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not Set');

  if (!tag) {
    console.error('Tag parameter is required');
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Tag parameter is required' }),
    };
  }

  try {
    console.log('Searching for resources in Cloudinary...');
    const { resources } = await cloudinary.api.resources_by_tag(tag, {
      resource_type: 'video',
      context: true,
      max_results: 500, // Adjust as needed
    });

    // Manually sort to emulate sort_by('public_id', 'desc')
    resources.sort((a: any, b: any) => b.public_id.localeCompare(a.public_id));

    console.log(`Found ${resources.length} resources.`);
    const songs = resources.map((file: any) => ({
      url: file.secure_url,
      title: file.original_filename || file.public_id,
      artist: file.context?.custom?.artist || 'Unknown Artist',
      albumArt: file.context?.custom?.albumArt,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(songs),
    };
  } catch (error) {
    console.error('Error fetching songs from Cloudinary:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching songs from Cloudinary' }),
    };
  }
};

export { handler };