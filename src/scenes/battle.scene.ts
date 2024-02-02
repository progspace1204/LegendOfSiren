import { createCharacterAnims } from '../anims/CharacterAnims'
import { setGameStatus, increment, addExp, setSecondTurn, setThirdTurn, addTurn } from '../common/state/game/reducer'
import { SIREN_SPINE, ENEMY_SPINE } from '../config/const'
import Character from '../objects/character'
import store from '../store'
// import type MyPlayer from '../characters/MyPlayer.ts'
import ResultWidget from '../widgets/resultWidget'
import { useWeb3Context } from '../hooks/web3Context'
import { onShowAlert } from '../store/utiles/actions'
import { itemModify } from '../common/api'
import { changeItem, global } from '../common/global'
// import Game from './game.scene'

export default class Battle extends Phaser.Scene {
  // myPlayer!: MyPlayer
  // mysprite: Phaser.Physics.Arcade.Sprite
  mysprite!: Phaser.GameObjects.Sprite
  sirenSpine!: SpineGameObject
  sirenAvatar!: Phaser.GameObjects.Sprite
  sirenHP!: Phaser.GameObjects.Sprite
  sirenHPFrame!: Phaser.GameObjects.Sprite
  sirenLevel!: Phaser.GameObjects.Text
  sirenHPLabel!: Phaser.GameObjects.Text
  siren!: Character
  robotAnimation!: Phaser.GameObjects.Sprite
  sirenAnimation!: Phaser.GameObjects.Sprite

  enemySpine!: SpineGameObject
  enemyAvatar!: Phaser.GameObjects.Sprite
  enemyHP!: Phaser.GameObjects.Sprite
  enemyHPFrame!: Phaser.GameObjects.Sprite
  enemyLevel!: Phaser.GameObjects.Text
  enemyHPLabel!: Phaser.GameObjects.Text
  enemy!: Character
  resultWidget!: ResultWidget
  invBtn!: Phaser.GameObjects.Image
  damageLabel!: Phaser.GameObjects.Text
  critiLabel!: Phaser.GameObjects.Image
  private fadeinTween!: Phaser.Tweens.Tween
  private fadeoutTween!: Phaser.Tweens.Tween
  attackType: number = 1

  constructor() {
    super('battle')
  }

  init() {}

  preload() {
    this.loadSpine()
  }

  create() {
    createCharacterAnims(this.anims)

    this.addSprites()
    this.createCharacter()
    this.createEnemy()
    this.createHud()
  }

  loadSpine() {
    this.load.setPath('assets/character/spine')
    this.load.spine(SIREN_SPINE, 'siren/siren1.json', 'siren/siren1.atlas')
    this.load.spine(ENEMY_SPINE, 'enemy/enemy1.json', 'enemy/enemy1.atlas')

    this.load.setPath('/')
  }

  addSprites() {
    // this.add.image(0, 0, 'battle-background', 0).setOrigin(0)

    this.add
      .sprite(1067, 120, 'heart-mark')
      .setScale(1)
      .setOrigin(0, 0.5)
    this.enemyAvatar = this.add.sprite(1160, 110, 'enemy-avatar').setScale(0.20)
    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    this.enemyLevel = this.add
      .text(1350, 110, `Level ${unit?.level}`, { font: '40px Anime Ace', color: '#ffffff' })
    this.enemyLevel.setOrigin(0.5, 0.5);
    this.enemyHPLabel = this.add
      .text(1365, 168, `${unit?.hp}/${unit?.hp}`, { fontFamily: 'Anime Ace', fontSize: '20px', color: '#e7ad21' })
    this.enemyHPLabel.setOrigin(0.5, 0.5);

    this.add
      .sprite(260, 120, 'heart-mark')
      .setScale(1)
      .setOrigin(0, 0.5)
    this.sirenAvatar = this.add.sprite(350, 110, 'siren-avatar').setScale(0.15)
    this.add
      .sprite(267, 235, 'embed-bar')
      .setScale(1)
      .setOrigin(0, 0.5)
    const embed = global.embed.filter(obj => obj.character === 'siren-1')
    for (let i = 0; i < embed.length; i ++) {
      let type = embed[i].item
      const count = embed[i].stock
      if (count > 0) {
        type = type.replace('_', '-')
        this.add
          .image(292 + 59 * i, 235, `item-${type}`)
          .setDisplaySize(43, 43)
          .setInteractive()
      }
    }
    this.sirenLevel = this.add
      .text(558, 110, `Level ${Math.floor(global.exp / 100) + 1}`, { font: '40px Anime Ace', color: '#ffffff' })
    this.sirenLevel.setOrigin(0.5, 0.5);
    this.sirenHPLabel = this.add
      .text(555, 168, `${global.hp}/${global.hp}`, { fontFamily: 'Anime Ace', fontSize: '20px', color: '#e7ad21' })
    this.sirenHPLabel.setOrigin(0.5, 0.5);
    // TODO: remove following after real anim finished
    this.robotAnimation = this.add
      .sprite(1325, 760, 'robot')
      .setOrigin(0.5, 1)
      .setScale(-1, 1)
      .setVisible(false)
    this.sirenAnimation = this.add
      .sprite(390, 760, 'siren')
      .setOrigin(0.5, 1)
      .setScale(1, 1)
      .setVisible(false)
  }

  attack(type: number) {
    this.attackType = type
    const turn = store.getState().app.game.turn
    if (turn) {
      this.enemy.attack()
    } else {
      this.siren.attack()
    }
  }

  enemyGetDamaged(damage: number) {
    this.enemy.getDamaged(damage)
  }

  sirenGetDamaged() {
    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    this.siren.getDamaged(unit?.damage)
    // this.siren.getDamaged(800)
  }

  onEnemyDead() {
    this.resultWidget.show(1)
    this.cameras.main.shake(1000, 0.01)
  }

  onSirenDead() {
    this.resultWidget.show(2)
    this.cameras.main.shake(1000, 0.01)
  }

  update() {
    // console.log('update')
  }

  endBattle() {
    this.scene.start('game')
  }

  damagePlay(critical: boolean, owner: boolean, damage: any) {
    const ownerPos = 500
    this.damageLabel.setText(`${damage}`)
    this.damageLabel.x = owner ? ownerPos : 1270

    this.fadeinTween = this.tweens
    .add({
      duration: 700,
      ease: 'Power1',
      hold: 200,
      repeat: 0,
      scaleX: 0.4,
      scaleY: 0.4,
      targets: this.damageLabel,
      yoyo: false,
      paused: true,
      alpha: 0,
      x: (owner ? ownerPos : 1270),
      y: 250,
    })
    .on('complete', () => {
      this.damageLabel.y = 450
      this.damageLabel.alpha = 1
      this.damageLabel.scaleX = 0.8
      this.damageLabel.scaleY = 0.8
      this.damageLabel.setVisible(false)  
      this.critiLabel.setVisible(false)
    })
    this.damageLabel.setVisible(true)
    this.fadeinTween.play()
    if (critical) {
      this.critiLabel.setVisible(true)
    }
  }
  createCharacter() {
    this.sirenSpine = this.add
      .spine(400, 750, SIREN_SPINE, 'Idle', true)
      .setScale(0.3)
      .on('complete', (entry: spine.TrackEntry) => {
        if (entry.animation.name === 'throw_swords') {
          let damage = global.damage
          if (this.attackType === 2 || this.attackType === 3) {
            damage = 190
            this.damagePlay(false, false, damage)
          } else {
            const r = Math.random()
            console.log(global.critical , r * 100)          
            if (global.critical > r * 100) {
              damage *= 1.5
              damage = Math.floor(damage)
              this.damagePlay(true, false, damage)
            }
            else {
              this.damagePlay(false, false, damage)
            }
          }
          this.enemyGetDamaged(damage)
          this.siren.character.play('Idle', true)
          this.attack(this.attackType)
          store.dispatch(addTurn())
          if (this.attackType === 2)  store.dispatch(setSecondTurn())
          if (this.attackType === 3)  store.dispatch(setThirdTurn())
        }
      })

    const throwAnim = this.sirenSpine.findAnimation('throw_swords')
    throwAnim.duration = 1.25

    this.siren = new Character(
      this,
      global.hp,
      global.hp,
      global.critical,
      2,
      this.sirenHP,
      this.sirenHPLabel,
      this.sirenSpine,
      this.sirenAnimation,
      1,
    )
    this.siren.on('dead', this.onSirenDead, this)
    this.siren.on('sirenDamage', () => {
      const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
      this.sirenGetDamaged()
      this.enemy.character.play('animation', true)
    })
  }

  createEnemy() {
    this.enemySpine = this.add
      .spine(1340, 750, ENEMY_SPINE, 'animation', true)
      .setScale(-0.3, 0.3)
    // .on('complete', (entry: spine.TrackEntry) => {
    //   console.log(entry.animation.name)
    //   if (entry.animation.name === 'throw_swords') {
    //     this.sirenGetDamaged()
    //     this.enemy.character.play('animation', true)
    //   }
    // }
    // )
    const unit = global.rooms.filter(obj => obj.chapter === global.chapter && obj.section === global.section).at(0)
    this.enemy = new Character(
      this,
      unit?.hp,
      unit?.hp,
      0,
      1,
      this.enemyHP,
      this.enemyHPLabel,
      this.enemySpine,
      this.robotAnimation,
      2,
    )
    this.enemy.on('dead', this.onEnemyDead, this)
    this.enemy.on('enemyAttack', () => {
      this.damagePlay(false, true, unit?.damage)
      this.siren.sirenDamageAnimation()
    })
      
    this.damageLabel = this.add
      .text(1270, 450, `150`, { font: '60px Anime Ace', color: 'red' })
      // .sprite(1270, 450, 'normal-damage')
      .setScale(0.8, 0.8)
      .setOrigin(0.5, 0.5)
      .setVisible(false)
    this.critiLabel = this.add
      .sprite(1200, 450, 'criti-bar')
      .setScale(1)
      .setOrigin(0, 0.5)
      .setVisible(false)
  }

  createHud() {
    // const { connected, chainID, address, connect } = useWeb3Context()  
    // Result Window
    this.resultWidget = new ResultWidget(this, 950, 500).setVisible(false)

    this.resultWidget.on('claim', () => {
      store.dispatch(setGameStatus(0))
      // store.dispatch(increment('loot'))
      itemModify(global.walletAddress, 'siren-1', 'loot', 1, global.room.chapter, global.room.section, global.chapter, global.section, (resp: any) => {
        if (resp.purchase !== undefined)
          changeItem(resp)
      })
      document.body.style.backgroundImage = 'url(assets/background/main.png)'
      this.scene.start('game')
      // store.dispatch(addExp(100))
    })
  }
}
