import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

const externalModules = [];

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
