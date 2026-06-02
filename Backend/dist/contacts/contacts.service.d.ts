import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContactDto: CreateContactDto): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
    findAll(): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
    update(id: number, updateContactDto: UpdateContactDto): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
    remove(id: number): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
}
