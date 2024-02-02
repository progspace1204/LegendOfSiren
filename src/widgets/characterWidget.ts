const avatarList = [1,2,3,4,5,6,7,8,9]
const weaponList = [1,2,3,4,5,6,7,8,9]
const stockTypes = [
  'loot',
  'gem_1',
  'infernal_1',
  'chimera_1',
  'gem_2',
  'infernal_2',
  'chimera_2',
  'gem_3',
  'infernal_3',
  'chimera_3',
]

import { StockProps } from '../common/state/game/state'
import { SIREN_SPINE } from '../config/const'
import StockItem from '../objects/stockItem'
import { changeItem, global } from '../common/global'
import { energySwap, itemModify, itemRevive } from '../common/api'

export default class CharacterWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image
  modelBackground: Phaser.GameObjects.Image
  closeBtn: Phaser.GameObjects.Image
  model: Array<Phaser.GameObjects.Image> = []
  weapon: Array<Phaser.GameObjects.Image> = []
  gem: Phaser.Structs.List<StockItem>
  embedGem: Phaser.Structs.List<Phaser.GameObjects.Image>
  sirenSpine!: SpineGameObject
  addWeapon!: Phaser.GameObjects.Image  
  addGem!: Phaser.GameObjects.Image
  addEnergy!: Phaser.GameObjects.Image
  health!: Phaser.GameObjects.Text
  critical!: Phaser.GameObjects.Text
  energy!: Phaser.GameObjects.Text
  levelLabel!: Phaser.GameObjects.Text
  expLabel!: Phaser.GameObjects.Text
  energySwapEdit!: Phaser.GameObjects.DOMElement
  swapAmount!: Number
  swapBtn!: Phaser.GameObjects.Image  
  private avatarTween: Array<Phaser.Tweens.Tween> =[]
  private weaponTween: Array<Phaser.Tweens.Tween> =[]
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    this.add(
      (this.background = scene.add
        .image(300, 0, 'inventory-frame')
        .setDisplaySize(700, 700)),
    )
    this.add(
      (this.modelBackground = scene.add
        .image(-480, 0, 'character-model-bg')
        .setDisplaySize(800, 700)),
    )
    this.add(
      (this.addGem = scene.add
        .image(-240,  -65, 'add-gem')
        .setDisplaySize(192, 69))
        .setInteractive()
        .on('pointerdown', () => {
          this.gemBuild()
          this.sceneMode(4)
        }),
    )
    this.add(
      (this.addEnergy = scene.add
        .image(-770,  -300, 'add-energy')
        .setDisplaySize(138, 47))
        .setInteractive()
        .on('pointerdown', () => {
          this.sceneMode(5)
        }),
    )
    this.add(
      (this.addWeapon = scene.add
        .image(-240, 105, 'add-weapon')
        .setDisplaySize(192, 69))
        .setInteractive()
        .on('pointerdown', () => {
          this.sceneMode(3)
        }),
    )
    this.add(
      (this.health = this.scene.add
      .text(-232, -173, `${1000}`, { font: '17px Anime Ace', color: '#ffffff' })
      )
    )
    this.add(
      (this.critical = this.scene.add
      .text(-232, -266, `10%`, { font: '17px Anime Ace', color: '#ffffff' })
      )
    )
    this.add(
      (this.energy = this.scene.add
      .text(-785, -307, `${global.energy}`, { font: '17px Anime Ace', color: '#ffffff' })
      )
    )
    this.add(
      (this.levelLabel = this.scene.add
      .text(-578, -250, `${1}`, { font: '90px Anime Ace', color: '#e62b2b' })
      .setOrigin(0.5, 0.5)
      )
    )
    this.add(
      (this.expLabel = this.scene.add
      .text(-570, -159, `40/100`, { font: '20px Anime Ace', color: '#ffffff' })
      .setOrigin(0.5, 0.5)
      )
    )

    this.modelBackground.setVisible(false)
    this.add(
      (this.closeBtn = scene.add
        .image(650, -366, 'close-btn')
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          this.sirenSpine.setVisible(false)
          this.setVisible(false)
          this.emit('closed')
        })),
    )
    for (let i = 0 ; i < avatarList.length ; i ++ ) {
      const row = Math.floor(i % 3)
      const col = Math.floor(i / 3)

      this.add(
        (this.model[i] = scene.add
          .image(row * 200 + 100, col * 200 - 200, `model-${avatarList[i]}`)
          .setDisplaySize(200, 200)
          .setInteractive()
          .on('pointerdown', () => {
            this.openModel(i)
            this.embedBuild()
        })),
      )
      this.avatarTween[i] = scene.tweens
      .add({
        duration: 1000,
        repeat: -1,
        ease: 'Power1',
        paused: true,
        scaleX: 0.5,
        scaleY: 0.5,
        targets: this.model[i],
        yoyo: true,
      })
      this.avatarTween[i].play()
    }
    for (let i = 0 ; i < weaponList.length ; i ++ ) {
      const row = Math.floor(i % 3)
      const col = Math.floor(i / 3)

      this.add(
        (this.weapon[i] = scene.add
          .image(row * 200 + 100, col * 200 - 200, `weapon-${weaponList[i]}`)
          .setDisplaySize(200, 200)
          .setInteractive()
          .on('pointerdown', () => {
        })),
      )
      this.weaponTween[i] = scene.tweens
      .add({
        duration: 800,
        repeat: -1,
        ease: 'Power1',
        paused: true,
        scaleX: 0.5,
        scaleY: 0.5,
        targets: this.weapon[i],
        yoyo: true,
      })
      this.weaponTween[i].play()
    }

    this.add(
      (this.energySwapEdit = this.scene.add.dom(295, -50, 'input', {
        type: 'number',
        value: '0',
        pattern: '[0-9]*',
        fontSize: '32px',
        backgroundColor: '#fff',
        color: '#000',
        padding: '8px',
        borderRadius: '8px',
        width: '100px',
        fontFamily: 'Anime Ace',
        textAlign: 'center',
      }))
    )
    const inputElement = this.energySwapEdit.node as HTMLInputElement;
    inputElement.addEventListener('input', () => {
      this.swapAmount = parseInt(inputElement.value, 10)
    });
    this.add(
      (this.swapBtn = scene.add
        .image(300,  25, 'swap-btn')
        .setDisplaySize(118, 46))
        .setInteractive()
        .on('pointerdown', () => {
          if (global.resource < this.swapAmount) {
            alert('Water is less than Swap Amount!!!')
            return
          }
          energySwap(global.walletAddress, 'siren-1', this.swapAmount, (resp: any) => {
            global.energy = resp.energy
            global.resource = resp.resource
            this.energy.setText(`${global.energy}`)
          })      
        }),
    )

    this.gem = new Phaser.Structs.List<StockItem>(null)
    this.embedGem = new Phaser.Structs.List<Phaser.GameObjects.Image>(null)
    this.gemBuild()
    this.embedBuild()
    this.setVisible(false)
    scene.add.existing(this)
    this.sirenSpine = this.scene.add
      .spine(280, 765, SIREN_SPINE, 'Idle', true)
      .setScale(0.25)
    this.sirenSpine.setVisible(false)
  }
  gemBuild() {
    this.energy.setText(`${global.energy}`)
    this.updateHpCritical(global.hp, global.critical)
    for (let j = 0; j < this.gem.length; j++) {
      this.gem.getAt(j).destroy()
      // this.gem.getAt(j).setVisible(false)
      // this.remove(this.gem.getAt(j))
    }
    this.gem = new Phaser.Structs.List<StockItem>(null)
    const data = global.purchase.filter(obj => obj.character === 'siren-1')
    for (let i = 0; i < data.length; i ++) {
      let type = data[i].item
      const row = Math.floor(i / 3)
      const col = Math.floor(i % 3)
      const count = data[i].stock
      if (count > 0 && type !== 'loot') {
        type = type.replace('_', '-')
        const newItem = new StockItem(this.scene, 0, 0, type, count)
          .setInteractive()
          .on('pointerdown', () => {
            console.log(global.room.chapter, global.room.section, global.chapter, global.section)
              itemModify(global.walletAddress, 'siren-1', data[i].item, -1, global.room.chapter, global.room.section, global.chapter, global.section, (resp: any) => {
                if (resp.purchase !== undefined) {
                  console.log('global', data[i].item, resp.critical)
                  changeItem(resp)
                  this.gemBuild()
                  this.embedBuild()
                }
              })
          })
        this.add(newItem)
        this.gem.add(newItem)
      }
    }
    this.arrangeGem()
  }
  embedBuild() {
    for (let j = 0; j < this.embedGem.length; j++) {
      this.embedGem.getAt(j).destroy()
      // this.embedGem.getAt(j).setVisible(false)
      // this.remove(this.embedGem.getAt(j))
    }
    const embed = global.embed.filter(obj => obj.character === 'siren-1')
    for (let i = 0; i < embed.length; i ++) {
      let type = embed[i].item
      const count = embed[i].stock
      if (count > 0) {
        type = type.replace('_', '-')
        console.log('aaa', type)
        const newItem = this.scene.add
          .image(-289 + 59 * i, 13, `item-${type}`)
          .setDisplaySize(40, 40)
          .setInteractive()
          .on('pointerdown', () => {
            itemRevive(global.walletAddress, 'siren-1', embed[i].item, (resp: any) => {
              if (resp.purchase !== undefined)
                changeItem(resp)
                this.embedBuild()
                this.gemBuild()
            })      
          })
        this.add(newItem)
        this.embedGem.add(newItem)
      }
    }
    this.setWeaponList(false)
  }
  openModel(type: number) {
    this.sceneMode(2)
  }
  arrangeGem() {
    for (let j = 0; j < this.gem.length; j++) {
      const row = Math.floor(j % 3)
      const col = Math.floor(j / 3)
      const cell = this.gem.getAt(j)
      cell.move(row * 200 + 100, col * 200 - 200)
    }
  }
  setModelList(visible: boolean) {
    // this.background.setVisible(visible)
    for (let i = 0 ; i < avatarList.length ; i ++ ) {
      this.model[i].setVisible(visible)
    }
  }
  setWeaponList(visible: boolean) {
    // this.background.setVisible(visible)
    for (let i = 0 ; i < weaponList.length ; i ++ ) {
      this.weapon[i].setVisible(visible)
    }
  }
  setGemList(visible: boolean) {
    // this.background.setVisible(visible)
    for (let i = 0 ; i < this.gem.length ; i ++ ) {
      const item = this.gem.getAt(i)
      item.visible = visible
    }
  }
  setEmbedList(visible: boolean) {
    // this.background.setVisible(visible)
    for (let i = 0 ; i < this.embedGem.length ; i ++ ) {
      const item = this.embedGem.getAt(i)
      item.visible = visible
    }
  }
  showStatus(visible: boolean) {
    this.setVisible(visible)
    this.sirenSpine.setVisible(false)
    if (visible)  this.sceneMode(1)
  }
  sceneMode(mode: number) {
    switch (mode) {
      case 1://modelList
        {
          this.setModelList(true)
          this.setWeaponList(false)
          this.setGemList(false)
          this.setEmbedList(false)
          this.modelBackground.setVisible(false)
          this.background.setVisible(true)
          this.sirenSpine.setVisible(false)
          this.addWeapon.setVisible(false)
          this.addGem.setVisible(false)
          this.addEnergy.setVisible(false)
          this.health.setVisible(false)
          this.energy.setVisible(false)
          this.critical.setVisible(false)
          this.expLabel.setVisible(false)
          this.levelLabel.setVisible(false)
          this.energySwapEdit.setVisible(false)
          this.swapBtn.setVisible(false)
          break;
        }
      case 2://ownModel
        {          
          this.setModelList(false)
          this.setWeaponList(false)
          this.setGemList(false)
          this.setEmbedList(true)
          this.modelBackground.setVisible(true)
          this.background.setVisible(true)
          // this.background.setVisible(false)
          this.sirenSpine.setVisible(true)
          this.addWeapon.setVisible(true)
          this.addGem.setVisible(true)
          this.addEnergy.setVisible(true)
          this.health.setVisible(true)
          this.energy.setVisible(true)          
          this.critical.setVisible(true)
          this.expLabel.setVisible(true)
          this.levelLabel.setVisible(true)
          this.energySwapEdit.setVisible(false)
          this.swapBtn.setVisible(false)
          break;
        }
      case 3://weaponModel
        {
          this.setWeaponList(true)
          this.setGemList(false)
          this.health.setVisible(true)
          this.energy.setVisible(true)
          this.critical.setVisible(true)
          this.background.setVisible(true)
          this.energySwapEdit.setVisible(false)
          this.swapBtn.setVisible(false)
          break;
        }
      case 4://gemModel
        {
          this.setGemList(true)
          this.setWeaponList(false)
          this.health.setVisible(true)
          this.critical.setVisible(true)
          this.background.setVisible(true)
          this.energySwapEdit.setVisible(false)
          this.swapBtn.setVisible(false)
          break;
        }
      case 5://waterSwap
        {
          this.setGemList(false)
          this.setWeaponList(false)
          this.energySwapEdit.setVisible(true)
          this.background.setVisible(true)
          this.swapBtn.setVisible(true)
          break;
        }
    }
  }
  updateHpCritical(hp: number, critical: number) {
    this.health.setText(`${hp}`)
    this.critical.setText(`${critical}%`)    
    const exp = Math.floor(global.exp % 100)
    const level = Math.floor(global.exp / 100) + 1
    this.levelLabel.setText(`${level}`)
    this.expLabel.setText(`${exp}/100`)
  }
}

