import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
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
    findOne(id: string): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
    update(id: string, updateContactDto: UpdateContactDto): Promise<{
        name: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        status: import(".prisma/client").$Enums.ContactStatus;
        phone: string | null;
        message: string;
    }>;
    remove(id: string): Promise<{
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
