import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { RatesModule } from './rates/rates.module';
import { WalletsModule } from './wallets/wallets.module';

const externalModules = [WalletsModule, RatesModule];

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/external',
        children: externalModules.map((module) => ({
          path: '/',
          module,
        })),
      },
    ]),
    ...externalModules,
  ],
})
export class ExternalGatewayModule {}
