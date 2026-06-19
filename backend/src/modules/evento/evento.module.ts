import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Evento])],
    providers: [EventoService],
    controllers: [EventoController],
})
export class EventoModule {}