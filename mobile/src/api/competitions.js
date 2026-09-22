import client from './client';

export async function fetchCompetitions() {
  const { data } = await client.get('/competitions');
  return data.competitions;
}

export async function fetchCompetition(id) {
  const { data } = await client.get(`/competitions/${id}`);
  return data.competition;
}

export async function fetchWinners(id) {
  const { data } = await client.get(`/competitions/${id}/winners`);
  return data.winners;
}

export async function fetchTestimonials(id) {
  const { data } = await client.get(`/competitions/${id}/testimonials`);
  return data.testimonials;
}

export async function fetchRewards(id) {
  const { data } = await client.get(`/competitions/${id}/rewards`);
  return data.rewards;
}

export async function fetchParticipation(id) {
  const { data } = await client.get(`/competitions/${id}/participation`);
  return data;
}

export async function registerForCompetition(id) {
  const { data } = await client.post(`/competitions/${id}/register`);
  return data.registration;
}

export async function fetchSubmission(id) {
  const { data } = await client.get(`/competitions/${id}/submission`);
  return data.submission;
}

export async function uploadSubmission(id, file, onUploadProgress) {
  const form = new FormData();
  form.append('file', file);

  const { data } = await client.post(`/competitions/${id}/submission`, form, {
    // Let React Native's networking layer set the multipart boundary itself -
    // pinning Content-Type here would strip it and break server-side parsing.
    headers: { 'Content-Type': undefined },
    onUploadProgress,
  });
  return data.submission;
}
