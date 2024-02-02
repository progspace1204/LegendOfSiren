import RoomItemWidget from "./roomItemWidget"
import { global } from "../common/global"

export default class RoomWidget extends Phaser.GameObjects.Container {
  scene: Phaser.Scene
  chapter: Phaser.Structs.List<RoomItemWidget>
  section: Phaser.Structs.List<RoomItemWidget>
  backBtn: Phaser.GameObjects.Image
  gMode: number
  nChapter: number//selected Chapter
  nSection: number//selected Section

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y)
    this.scene = scene
    this.nChapter = 1
    this.nSection = 1
    const chapterPos = [
      { x: -600, y: 50},
      { x: -300, y: -100},
      { x: 0, y: 80},
      { x: 300, y: -140},
      { x: 600, y: -190},
      { x: 900, y: 20},
    ]
    const gChapter = global.room.chapter
    const gSection = global.room.section    

    this.chapter = new Phaser.Structs.List(null)
    this.section = new Phaser.Structs.List(null)
    this.gMode = 1

    for (let i = 0 ; i < chapterPos.length ; i ++) {
      // let enable = gChapter > i ? true : false
      let enable = i === 0 ? true : false
      const chapterItem = new RoomItemWidget(this.scene, chapterPos[i].x, chapterPos[i].y, i+1, enable, 1)
        .setSize(107, 112)
        .setInteractive()
        .on('pointerdown', () => {
          if (enable) {
            this.nChapter = i + 1
            this.gameMode(2)
          }
        })
      this.chapter.add(chapterItem)
      this.add(chapterItem)
    }
    this.add(
      (this.backBtn = scene.add
        .image(830, -256, 'come-back')
        .setScale(0.5)
        .setInteractive()
        .on('pointerdown', () => {
          if (this.gMode === 1) {
            this.emit('cancel')
          }
          if (this.gMode === 2) {
            this.gameMode(1)
          }          
        })),
    )
    this.setVisible(false)
    scene.add.existing(this)
  }
  gameMode(mode: number) {
    this.gMode = mode
    if (mode === 1) {//chapter
      const gChapter = global.room.chapter
      document.body.style.backgroundImage = 'url(assets/background/chapter.png)'
      for (let i = 0 ; i < this.chapter.length ; i ++) {
        this.chapter.getAt(i).setVisible(true)
      }
      for (let i = 0 ; i < this.section.length ; i ++) {
        this.section.getAt(i).destroy()
      }
    }

    if (mode === 2) {//section
      const gChapter = global.room.chapter
      const gSection = global.room.section
      const sectionPos = [
        { x: -250, y: 0},
        { x: -50, y: 0},
        { x: 200, y: 0},
        { x: 400, y: 0},
      ]
      this.section = new Phaser.Structs.List(null)

      document.body.style.backgroundImage = 'url(assets/background/section.png)'
      for (let i = 0 ; i < this.chapter.length ; i ++) {
        this.chapter.getAt(i).setVisible(false)
      }
      for (let i = 0 ; i < this.section.length ; i ++) {
        this.section.getAt(i).destroy()
      }

      for (let i = 0 ; i < sectionPos.length ; i ++) {
        let enable = gChapter > this.nChapter || gSection >= i + 1 ? true : false
        const sectionItem = new RoomItemWidget(this.scene, sectionPos[i].x, sectionPos[i].y, i+1, enable, 2)
          .setSize(107, 112)
          .setInteractive()
          .on('pointerdown', () => {
            if (enable) {
              this.nSection = i + 1
              this.emit('start', this.nChapter, this.nSection)
            }
          })
          .setVisible(true)
        this.section.add(sectionItem)
        this.add(sectionItem)    
        }
    }
  }
}
