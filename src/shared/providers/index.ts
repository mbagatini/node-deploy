import { container } from 'tsyringe';
import HandlebarsTemplateEmailProvedor from './ProvedorTemplateEmail/implementations/HandlebarsTemplateEmailProvedor';
import IProvedorTemplateEmail from './ProvedorTemplateEmail/models/IProvedorTemplateEmail';
import EtherealProvedorEmail from './ProvedorEmail/implementations/EtherealProvedorEmail';
import IProvedorEmail from './ProvedorEmail/models/IProvedorEmail';
import IProvedorToken from './ProvedorToken/models/IProvedorToken';
import JsonWebTokenProvedor from './ProvedorToken/implementations/JsonWebTokenProvedor';

container.registerSingleton<IProvedorTemplateEmail>(
  'ProvedorTemplateEmail',
  HandlebarsTemplateEmailProvedor,
);

container.registerInstance<IProvedorEmail>(
  'ProvedorEmail',
  container.resolve(EtherealProvedorEmail),
);
container.registerSingleton<IProvedorToken>(
  'ProvedorToken',
  JsonWebTokenProvedor,
);
