export interface Imedia {
     image?: string[];
     video?: string[];
     document?: string[];
     title: string;
     description:string;
     createdAt: Date;
     updatedAt: Date;
     isDeleted: boolean;
     deletedAt?: Date;
}

export type ImediaFilters = {
     searchTerm?: string;
};
