import client from './client';

export async function loginRequest(email, password) {
  const { data } = await client.post('/auth/login', { email, password });
  return data; // { token, user }
}

export async function registerRequest(name, email, password) {
  const { data } = await client.post('/auth/register', { name, email, password });
  return data; // { token, user }
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me');
  return data.user;
}
