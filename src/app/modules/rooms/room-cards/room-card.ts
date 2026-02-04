export interface RoomCard {
    id: number;
    number: string;
    floor: string;
    type: string;
    bedType: string;
    guests: string;
    maxGuests: number;
    price: number;
    status: 'Occupied' | 'Available' | 'Cleaning' | 'Booked';
    guestName?: string;
    idNumber?: string;
    checkIn?: string;
    checkOut?: string;
    note?: string;
    amenities: string[];
}
