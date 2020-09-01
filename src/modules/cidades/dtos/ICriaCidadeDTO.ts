import Estado from "@modules/estados/infra/typeorm/entities/Estado";

export interface IRequestDTO {
    nome: string;
    uf: string;
}

export interface ICriaCidadeDTO {
    nome: string;
    estado: Estado;
}