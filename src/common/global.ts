export interface UserProfile {
    walletAddress: string,
    userRef: string,
    ref: string,
    referals: number,
    exp: number,
    level: number,
    purchase: [
        {
            character: string, 
            item: string,
            stock: number
        }
    ],        
    embed: [
        {
            character: string, 
            item: string,
            stock: number
        }
    ],        
    hp: number,
    damage: number,
    critical: number,
    rooms: [
        {
            chapter: number,
            damage: number,
            hp: number,
            level: number,
            section: number
        }
    ],
    room: any,
    chapter: number,
    section: number,
    wall: number,
    energy: number,
    resource: Number,
}

export let global: UserProfile = {
    walletAddress: '',
    userRef: '',
    ref: '',
    referals: 0,
    exp: 100,
    level: 0,
    purchase: [
        {
            character: 'siren-1', 
            item: 'gem-1',
            stock: 0
        }
    ],
    embed: [
        {
            character: 'siren-1', 
            item: 'gem-1',
            stock: 0
        }
    ],        
    hp: 1500,
    damage: 150,
    critical: 10,
    rooms: [
        {
            chapter: 1,
            damage: 150,
            hp: 80,
            level: 1,
            section: 1,
        }
    ],
    room: [{
        chapter: 1,
        section: 1,
    }],
    chapter: 1,
    section: 1,
    wall: 0,
    energy: 0,
    resource: 0,
  }

  export const changeItem = (resp: any) => {
    global.hp = resp.hp
    global.damage = resp.damage
    global.critical = resp.critical
    global.purchase = resp.purchase
    global.embed = resp.embed
    global.exp = resp.exp
    global.energy = resp.energy
  }