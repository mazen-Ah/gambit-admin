interface IRoles {
    id: number;
    name: string;
    guard_name: string;
    pivot: {
        role_id: number;
        permission_id: number;
    }
                       
    }
    
export interface IUserData {
 id?: number;
 first_name?: string;
 email?: string;
 admin?: number;
 latest_offers?: number;
 subscribed_to_notifications?: number;
 roles?: IRoles[];
}
    


