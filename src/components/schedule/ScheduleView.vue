<template>
  <div>
    <div v-for="(item) in this.rasp" :key="item.id" class="flex w-full mb-1.5">
      <row-item v-if="item.isHeader == undefined">
        <span>{{item.num}}</span>
      </row-item>
      <row-item class="!basis-[10%]" v-if="item.isHeader == undefined">
        <span v-html="callings[item.num]"></span>
      </row-item>
      <row-item v-if="item.nameGroup != '' && item.nameGroup != undefined && item.nameGroup != null
        && printGroupName && item.isHeader == undefined" class="!basis-2/12">
          <span v-html="item.nameGroup"></span>
      </row-item>
      <row-item class="!basis-7/12 !justify-start" v-if="item.isHeader == undefined">
        <div>
          <b>{{item.title}}</b><br>
          <div>{{item.teachername}}</div>
          <div v-if="item.resource != ''">
            <hr>
            <div v-html="item.resource"></div>
          </div>
        </div>
      </row-item>
      <row-item v-if="item.isHeader == undefined">
          <div>
            {{item.cab}}
          </div>
      </row-item>
      <row-item v-if="item.isHeader != undefined" isGroupHeader="true">
          <h1>{{item.name}}</h1>
      </row-item>
    </div>
  </div>
</template>

<script>
import PresetValues from '../../helpers/PresetValues'
import rowItem from './RowItem.vue'

export default {
  props: ['rasp', 'printGroupName'],
  components: {
    rowItem
  },
  data () {
    return {
      callings: PresetValues.callings
    }
  },
  functions: {
    isHeader (item) {
      return item.isHeader !== undefined
    }
  }
}
</script>
