import axios from 'axios';

const footballDataApi = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || ''
  }
});

export async function GET() {
  try {
    const response = await footballDataApi.get('/matches?status=LIVE');
    return Response.json(response.data);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return Response.json({ error: 'Failed to fetch live matches' }, { status: 500 });
  }
}
