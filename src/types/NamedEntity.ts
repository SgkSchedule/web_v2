export interface NamedEntity {
    id: number;
    name: string;
}

export interface Building extends NamedEntity {
    groups: number[];
}
