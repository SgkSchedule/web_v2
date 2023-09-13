<template>
  <div class='grid w-full gap-1.5' v-bind:class="'gap-rows-' + this.rasp.length">
    <div v-for="(item) in this.rasp" :key="item.id" class="grid w-full gap-x-2 sm:gap-x-1.5 grid-cols-10">
      <row-item class="sm:col-span-1" v-bind:class="[activeTab == 'user' ? 'col-span-1' : 'col-span-2']" v-if="item.isHeader == undefined">
        <span>{{item.num}}</span>
      </row-item>
      <row-item class="sm:col-span-1" v-bind:class="[activeTab == 'user' ? 'col-span-1' : 'col-span-2']" v-if="item.isHeader == undefined">
        <span v-html="callings[item.num]"></span>
      </row-item>
      <row-item v-if="item.nameGroup != '' && item.nameGroup != undefined && item.nameGroup != null
        && activeTab !== 'building' && item.isHeader == undefined" class="col-span-2 text-center">
          <span v-html="item.nameGroup"></span>
      </row-item>
      <row-item class="!justify-start" v-if="item.isHeader == undefined" v-bind:class="[activeTab == 'user' ? 'col-span-5' : ['col-span-5', 'sm:col-span-7']]">
        <div>
          <div class="font-bold">{{item.title}}</div>
          <div>{{item.teachername}}</div>
        </div>
      </row-item>
      <row-item v-if="item.isHeader == undefined">
          <div class="text-center">
            {{item.cab}}
          </div>
      </row-item>
      <row-item v-if="item.isHeader != undefined" isGroupHeader="true" class="col-span-10">
          <h1>{{item.name}}</h1>
      </row-item>
    </div>
  </div>
</template>

<script>
import PresetValues from '../../helpers/PresetValues'
import rowItem from './RowItem.vue'

export default {
  props: ['rasp', 'activeTab'],
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
