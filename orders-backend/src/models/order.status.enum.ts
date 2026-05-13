export enum OrderStatus {
  CREATED = 'CREATED',
  VALIDATED = 'VALIDATED',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED'
}


export interface StatusOption {
  label: string; // Ce que l'utilisateur voit (ex: "Expédiée")
  value: OrderStatus; // La valeur de l'Enum (ex: "SHIPPED")
}