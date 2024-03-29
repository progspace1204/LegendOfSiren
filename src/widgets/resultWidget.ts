import { global } from '../common/global'
export default class ResultWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  background: Phaser.GameObjects.Image
  claimBtn: Phaser.GameObjects.Image
  claimBox: Phaser.GameObjects.Image
  caption: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene    
    this.add(
      (this.background = scene.add.image(0, 0, 'result-bg')),
      // .setDisplaySize(800, 600)
    )
    // const shader = scene.add.shader('outer-glow-shader', 0, 0, 800, 600);

    // // Set the Image object as the input for the Shader object
    // shader.setRenderToTexture('result-bg');

    // // Set the color and strength of the outer glow effect
    // shader.setUniform('u_glowColor', new Float32Array([1.0, 1.0, 1.0]));
    // shader.setUniform('u_glowStrength', 0.5);

    this.add(
      (this.claimBtn = scene.add
        .image(20, 200, 'small-btn')
        .setInteractive()
        .on('pointerdown', () => {
          this.setVisible(false)
          this.emit('claim')
        })),
    )
    this.add(
      (this.claimBox = scene.add
        .image(-100, 200, 'claim-box')
      ),
    )
    this.add(
      (this.caption = scene.add
        .text(20, 200, `Claim`, { font: '30px Anime Ace', color: '#ffffff' })
        .setOrigin(0.5, 0.5)),
    )

    scene.add.existing(this)
    this.setVisible(false)
  }
  show(owner: number) {
    if ((global.section === 2 || global.section === 4)) {// && global.chapter * 4 + global.section + 1 > global.room.chapter * 4 + global.room.section) {
      this.caption.setText('Claim')
      this.claimBox.setVisible(true)
    }
    else {
      if (owner === 2) {
        this.caption.setText('Back')
        this.claimBox.setVisible(false)
        this.background.setVisible(false)
      }
      else {
        this.background.setVisible(true)
        this.caption.setText('Back')
        this.claimBox.setVisible(false)
      }
    }
    this.setVisible(true)
  }
}
