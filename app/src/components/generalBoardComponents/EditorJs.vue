<template>
  <div class="editor-wrapper mb-3">
    <div ref="editorHolder" class="editor-container"></div>
  </div>
</template>

<script>
import EditorJS from '@editorjs/editorjs'
import ImageTool from '@editorjs/image'
import Header from '@editorjs/header'
import Paragraph from '@editorjs/paragraph'
import CheckList from '@editorjs/checklist'
import YoutubeEmbed from 'editorjs-youtube-embed'
import AttachesTool from '@editorjs/attaches'
import { toCdnUrl } from '@/config'

export default {
  name: 'EditorComponent',
  props: {
    content: Object,
    pbInstance: Object,
    onUploads: Function
  },
  mounted() {
    const vm = this
    const pb = this.pbInstance

    this.editor = new EditorJS({
      data: this.content || {},
      holder: this.$refs.editorHolder,
      placeholder: '내용을 입력하세요.',
      tools: {
        header: Header,
        paragraph: { class: Paragraph, inlineToolbar: true },
        checkList: { class: CheckList, inlineToolbar: true },
        youtubeEmbed: YoutubeEmbed,
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                try{
                const formData = new FormData()
                formData.append('file', file)
                const record = await pb.collection('files').create(formData)
                const url = toCdnUrl(pb.files.getUrl(record, record.file));
                vm.$emit('uploadFile', { id: record.id, url })
                return { success: 1, file: { url, name: file.name, title: file.name, id: record.id } }
                } catch(err){
                    console.error(err)
                }

            }
            }
          }
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formData = new FormData()
                formData.append('image', file)
                const record = await pb.collection('images').create(formData)
                const url = toCdnUrl(pb.files.getUrl(record, record.image))
                vm.$emit('uploadImage', { id: record.id, url })
                return { success: 1, file: { url, id: record.id } }
              }
            }
          }
        }
      }
    })
  },
  methods: {
    async save() {
      return await this.editor.save()
    },
    async destroyEditor() {
      if (this.editor?.destroy) {
        await this.editor.destroy()
      }
    }
  },
  beforeUnmount() {
    this.destroyEditor()
  }
}
</script>

<style scoped>
.editor-wrapper {
  border-top: 1px solid #ccc;
  padding: 1rem;
  margin-top: 30px !important;
}
</style>
