import axios from 'axios';

const footballDataApi = axios.create({
  baseURL: 'https://api.football-data.org/v4',
  headers: {
    'X-Auth-Token': process.env.FOOTBALL_DATA_API_KEY || ''
  }
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await footballDataApi.get(`/matches/${id}`);
    return Response.json(response.data);
  } catch (error) {
    console.error('Error fetching match details:', error);
    return Response.json({ error: 'Failed to fetch match details' }, { status: 500 });
  }
}
