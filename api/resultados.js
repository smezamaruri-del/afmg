const TEAM_MAP = {
  'Mexico':'México', 'South Africa':'Sudáfrica', 'Korea Republic':'Corea del Sur', 'South Korea':'Corea del Sur',
  'Czechia':'República Checa', 'Czech Republic':'República Checa', 'Canada':'Canadá', 'Bosnia and Herzegovina':'Bosnia-Herzegovina',
  'Qatar':'Qatar', 'Switzerland':'Suiza', 'Brazil':'Brasil', 'Morocco':'Marruecos', 'Haiti':'Haití', 'Scotland':'Escocia',
  'United States':'Estados Unidos', 'USA':'Estados Unidos', 'Paraguay':'Paraguay', 'Australia':'Australia', 'Türkiye':'Turquía', 'Turkey':'Turquía',
  'Germany':'Alemania', 'Curacao':'Curazao', 'Curaçao':'Curazao', "Côte d'Ivoire":'Costa de Marfil', 'Ivory Coast':'Costa de Marfil', 'Ecuador':'Ecuador',
  'Netherlands':'Países Bajos', 'Japan':'Japón', 'Sweden':'Suecia', 'Tunisia':'Túnez', 'Belgium':'Bélgica', 'Egypt':'Egipto',
  'Iran':'Irán', 'IR Iran':'Irán', 'New Zealand':'Nueva Zelanda', 'Spain':'España', 'Cape Verde':'Cabo Verde', 'Saudi Arabia':'Arabia Saudita', 'Uruguay':'Uruguay',
  'France':'Francia', 'Senegal':'Senegal', 'Iraq':'Irak', 'Norway':'Noruega', 'Argentina':'Argentina', 'Algeria':'Argelia', 'Austria':'Austria', 'Jordan':'Jordania',
  'Portugal':'Portugal', 'DR Congo':'RD Congo', 'Congo DR':'RD Congo', 'Uzbekistan':'Uzbekistán', 'Colombia':'Colombia', 'England':'Inglaterra', 'Croatia':'Croacia', 'Ghana':'Ghana', 'Panama':'Panamá'
};
function nameOf(team){ return TEAM_MAP[team?.name] || team?.name || ''; }
function scoreOf(match){
  const s = match.score || {};
  const ft = s.fullTime || {};
  const ht = s.halfTime || {};
  const home = ft.home ?? ht.home;
  const away = ft.away ?? ht.away;
  if (home === null || home === undefined || away === null || away === undefined) return null;
  return {home, away, text:`${home}-${away}`};
}
function winnerOf(match, homeName, awayName, goals){
  const winner = match.score?.winner;
  if (winner === 'HOME_TEAM') return homeName;
  if (winner === 'AWAY_TEAM') return awayName;
  if (winner === 'DRAW') return 'Empatan';
  if (!goals) return null;
  if (goals.home > goals.away) return homeName;
  if (goals.away > goals.home) return awayName;
  return 'Empatan';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=600');
  try {
    const token = process.env.FOOTBALL_DATA_API_KEY;
    if (!token) {
      return res.status(200).json({ source:'sin FOOTBALL_DATA_API_KEY', updatedAt:new Date().toISOString(), items:[] });
    }
    const url = 'https://api.football-data.org/v4/competitions/WC/matches?season=2026';
    const response = await fetch(url, { headers: { 'X-Auth-Token': token }});
    if (!response.ok) {
      return res.status(response.status).json({ error:true, message:`football-data.org respondió ${response.status}` });
    }
    const data = await response.json();
    const valid = new Set(['FINISHED','IN_PLAY','PAUSED']);
    const items = (data.matches || [])
      .filter(m => valid.has(m.status))
      .map(m => {
        const local = nameOf(m.homeTeam);
        const visitante = nameOf(m.awayTeam);
        const goals = scoreOf(m);
        return {
          local,
          visitante,
          marcador: goals?.text || '',
          ganador: winnerOf(m, local, visitante, goals),
          estado: m.status,
          finalizado: m.status === 'FINISHED',
          fecha: m.utcDate || null
        };
      });
    return res.status(200).json({ source:'football-data.org', updatedAt:new Date().toISOString(), items });
  } catch (error) {
    return res.status(500).json({ error:true, message:error.message });
  }
};
