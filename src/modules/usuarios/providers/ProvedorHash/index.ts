import { container } from 'tsyringe';
import IProvedorHash from '@modules/usuarios/providers/ProvedorHash/models/IProvedorHash';
import BCryptProvedorHash from '@modules/usuarios/providers/ProvedorHash/implementations/BCryptProvedorHash';

container.registerSingleton<IProvedorHash>('ProvedorHash', BCryptProvedorHash);
