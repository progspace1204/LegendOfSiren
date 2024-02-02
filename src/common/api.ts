import axios from "axios";
import { global } from './global'
import config from '../utils/config'

axios.defaults.baseURL = `${config.server}:${config.port}${config.baseURL}`
export const getProfile = async (walletAddress: string, character: string) => {
    const data = (await axios.post('/user/profile', {
        walletAddress,
        character
    })).data
    
    const user = data.user
    global.hp = user.hp
    global.damage = user.damage
    global.critical = user.critical
    global.purchase = data.purchase
    global.embed = data.embed
    global.exp = user.exp
    global.room = user.room
    global.userRef = user.userRef
    global.wall = user.wall
    global.energy = user.energy
    global.resource = user.resource
}
export const referalAdd = async () => {
    await axios.post('/user/referal', {
        guest: global.userRef,
        introducer: global.ref,
    })
}
export const getRoom = async () => {
    const rooms = await (await axios.post('/user/room', {})).data.room
    global.rooms = rooms
}

export const itemModify = async (walletAddress: string, character: string = 'siren-1', item: string, amount: number, currentChaper: number, currentSection: number, selectChapter: number, selectSection: number, cb: Function) => {
    const data = (await axios.post('/user/item', {
        walletAddress,
        character,
        item,
        amount,
        currentChaper,
        currentSection,
        selectChapter,
        selectSection,
    })).data;

    const user = data.user

    global.room = user.room
    cb({
        critical: user.critical,
        hp: user.hp,
        damage: user.damage,
        purchase: data.purchase,
        embed: data.embed,
        exp: user.exp,
        room: user.room,
        wall: user.wall,
        energy: user.energy,
    });
}

export const itemRevive = async (walletAddress: string, character: string = 'siren-1', item: string, cb: Function) => {
    const data = (await axios.post('/user/item/revive', {
        walletAddress,
        character,
        item
    })).data;

    const user = data.user

    cb({
        critical: user.critical,
        hp: user.hp,
        damage: user.damage,
        purchase: data.purchase,
        embed: data.embed,
        exp: user.exp,
        room: user.room,
        wall: user.wall,
    });
}

export const energySwap = async (walletAddress: string, character: string = 'siren-1', amount: Number, cb: Function) => {
    const data = (await axios.post('/user/swap/energy', {
        walletAddress,
        character,
        amount
    })).data;

    // const user = data.user

    cb({
        energy: data.energy,
        resource: data.resource,
    });
}