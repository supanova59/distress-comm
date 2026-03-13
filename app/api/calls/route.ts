import { NextResponse } from 'next/server';

export async function GET() {
  const calls = [
    { id: '1', location: { lat: 34.0522, lng: -118.2437 }, severity: 'high', status: 'active', message: 'Trapped in building, structural damage', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), node: 'Node-A1' },
    { id: '2', location: { lat: 34.0622, lng: -118.2537 }, severity: 'medium', status: 'active', message: 'Need medical supplies for 3 injured', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), node: 'Node-B2' },
    { id: '3', location: { lat: 34.0422, lng: -118.2337 }, severity: 'critical', status: 'active', message: 'Fire spreading rapidly, need evac', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), node: 'Node-C3' },
    { id: '4', location: { lat: 34.0722, lng: -118.2637 }, severity: 'low', status: 'resolved', message: 'Power restored to sector', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), node: 'Node-D4' },
    { id: '5', location: { lat: 34.0322, lng: -118.2237 }, severity: 'high', status: 'active', message: 'Severe flooding in basement level', timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), node: 'Node-E5' },
    { id: '6', location: { lat: 34.0822, lng: -118.2137 }, severity: 'medium', status: 'active', message: 'Food and water running low', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), node: 'Node-F6' },
  ];
  return NextResponse.json(calls);
}
