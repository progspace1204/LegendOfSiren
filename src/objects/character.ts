import { setGameTurn, setTurnFormat } from '../common/state/game/reducer'
import store from '../store'

export default class Character extends Phaser.Events.EventEmitter {
  scene: Phaser.Scene
  hp: number = 1000
  maxHp: number = 1000
  level: number = 1
  critical: number = 0
  owner: number = 1
  hpLabel: Phaser.GameObjects.Text
  hpImage: Phaser.GameObjects.Sprite
  character: SpineGameObject
  characterDown: Phaser.GameObjects.Sprite
  private imageW: number = 0
  private dead: boolean = false
  movingTween!: Phaser.Tweens.Tween

  constructor(
    scene: Phaser.Scene,
    hp: number = 1000,
    maxHp: number = 1000,
    critical: number = 0,
    level: number,
    hpImage: Phaser.GameObjects.Sprite,
    hpLabel: Phaser.GameObjects.Text,
    character: SpineGameObject,
    characterDown: Phaser.GameObjects.Sprite,
    owner: number,
  ) {
    super()
    this.scene = scene
    this.hp = hp
    this.maxHp = maxHp
    this.level = level    
    this.hpImage = hpImage
    this.hpLabel = hpLabel
    this.owner = owner
    // this.imageW = hpImage.displayWidth
    this.character = character
    this.characterDown = characterDown
    this.characterDown.on('animationcomplete', (animation: any, frame: any) => {
      // console.log(animation)
      if (animation.key === 'robot-stabb') {
        if (!this.dead) {
          this.characterDown.anims.play('robot-run')
          this.movingTween = this.scene.tweens.add({
            targets: this.characterDown,
            x: 700,
            duration: 700,
            ease: 'Power2',
            paused: true,
            repeat: 0
          })
          .on('complete', () => {
            this.movingTween.stop()
            this.characterDown.anims.play('robot-punch')
            var timer = this.scene.time.addEvent({
              delay: 900,
              callback: () => {
                // this.character.setAlpha(100)
                // this.characterDown.setVisible(false)
                // store.dispatch(setGameTurn())
                this.emit('enemyAttack')
              },
              callbackScope: this,
              loop: false
            })
          })
          this.movingTween.play()
        }
        else {
          this.onDead()
          store.dispatch(setGameTurn())
        }
      }
      // if (animation.key === 'robot-run') {
      //   // this.movingTween.stop()
      //   this.characterDown.anims.play('robot-punch')
      // }
      if (animation.key === 'robot-punch') {
        this.character.setAlpha(100)
        this.characterDown.setVisible(false)
        store.dispatch(setGameTurn())
        // this.emit('enemyAttack')
      }
      if (animation.key === 'siren-stabb') {
        this.character.setAlpha(100)
        this.characterDown.setVisible(false)
        this.emit('sirenDamage')
      }
    }, this)

    // const throwAnim = this.character.findAnimation('throw_swords')
    // throwAnim.duration = 1.25

    this.on('dead', this.onDead, this)
  }

  getDamaged(damage: number = 150) {
    if (this.hp > 0) {
      this.hp -= damage
      if (this.hp < 0 ) this.hp = 0
      this.hpLabel.setText(`${this.maxHp}/${this.hp}`)
      if (this.hp > 0) {
        this.handleDamageAnim()
      }
      this.dead = false
    }
    if (this.hp <= 0) {
      if (this.dead === false) {
        this.emit('dead')
        this.dead = true
      } else {
        return
      }
    }
  }

  sirenDamageAnimation() {
    this.character.setAlpha(0)
    this.characterDown.setVisible(true)
    this.characterDown.anims.play('siren-stabb')
  }

  attack() {
    const turn = store.getState().app.game.turn
    if (turn) {
      this.characterDown.setX(1325)
      this.character.setAlpha(0)
      this.characterDown.setVisible(true)
      this.characterDown.anims.play('robot-stabb')
    } else {
      this.character.play('throw_swords')
      store.dispatch(setGameTurn())
    }
  }

  onDead() {
    this.character.setAlpha(0)
    store.dispatch(setTurnFormat())
    // this.character.setVisible(true)

    // this.character.setRotation(Phaser.Math.PI2 / 2);
    if (this.owner === 2)
      this.characterDown.setVisible(true)
      this.characterDown.anims.play('robot-down')
    // this.character.rotation = Phaser.Math.PI2 / 4;
  }

  handleDamageAnim() {}
}
