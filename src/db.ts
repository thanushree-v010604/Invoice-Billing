import Dexie, { type Table } from 'dexie';
import { type Invoice, type BusinessProfile } from './types';

export class BillingDatabase extends Dexie {
  invoices!: Table<Invoice>;
  profile!: Table<BusinessProfile>;

  constructor() {
    super('BillingDB');
    this.version(1).stores({
      invoices: '++id, invoiceNumber, customerName, date, status',
      profile: '++id, name'
    });
  }
}

export const db = new BillingDatabase();
