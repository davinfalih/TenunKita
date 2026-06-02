import { CreateContactDto } from './create-contact.dto';
import { ContactStatus } from '@prisma/client';
declare const UpdateContactDto_base: import("@nestjs/common").Type<Partial<CreateContactDto>>;
export declare class UpdateContactDto extends UpdateContactDto_base {
    status?: ContactStatus;
}
export {};
