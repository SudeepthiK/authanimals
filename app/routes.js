const status = require('./handlers/status');
const auth = require('./handlers/auth');
const getAnimals = require('./handlers/get-animals');
const tokenValidation = require('./handlers/token-validation');
const discovery = require('./handlers/discovery');
const heyyo = require('./handlers/heyyo');

exports.create = (app) => {
  app.get({ name: "status",
    path: "/status"
  }, [status]);

  app.post({ name: "authenticate",
    path: "/authenticate"
  }, [auth]);

  app.get({ name: "animals",
    path: "/animals"
  }, [tokenValidation, getAnimals]);

  app.get({ name: "heyyo",
    path: "/heyyo"
  }, [heyyo]);


  app.get({ name: "root",
    path: "/",
  }, [discovery(app.router)]);
}
