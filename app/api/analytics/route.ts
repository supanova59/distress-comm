import { NextResponse } from 'next/server';

export async function GET() {
  const analytics = {
    disastersSolved: 142,
    nodesConnected: 87,
    averageResponseTime: '4.2 mins',
    callsOverTime: [
      { time: '00:00', calls: 12 },
      { time: '04:00', calls: 8 },
      { time: '08:00', calls: 45 },
      { time: '12:00', calls: 60 },
      { time: '16:00', calls: 30 },
      { time: '20:00', calls: 15 },
    ],
    severityDistribution: [
      { name: 'Critical', value: 15 },
      { name: 'High', value: 35 },
      { name: 'Medium', value: 40 },
      { name: 'Low', value: 10 },
    ]
  };
  return NextResponse.json(analytics);
}
