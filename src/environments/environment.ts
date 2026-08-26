const urls = {
  site: 'https://theteachly.com',
  api: 'http://127.0.0.1:8000',
  //api: 'https://apifuturexcamp.theteachly.com',
  uploads: 'https://apifuturexcamp.theteachly.com/uploads',
  zenAi: 'https://zenai.theteachly.com',
  cadApi: 'https://cadapi.theteachly.com',
  aiTraining: 'https://aitraining.theteachly.com',
  circuit: 'https://circuit.theteachly.com',
  aiLab: 'https://aiab.theteachly.com',
  studentPanel: 'https://student.theteachly.com',
  productionStudentPanel: 'https://student.theteachly.com',
};

export const environment = {
  production: false,
  apiUrl: urls.api,
  urls,
  simulatorUrls: {
    circuit: `${urls.circuit}/`,
    ai: `${urls.aiLab}/`,
    droneDownload: `${urls.uploads}/Teachly%20Drone%20Simulator.zip`,
  },
  studentPanel: {
    loginUrl: `${urls.studentPanel}/auth/login`,
    ssoUrl: `${urls.studentPanel}/auth/sso`,
  },
};
