<template>
    <section class="page-home">
        <Layout>
            <Header class="header">
              <h3>header</h3>
            </Header>
            <Layout>
                <Sider ref="side" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" :style="{background: '#fff', overflow: isCollapsed ? 'visible' : 'hidden'}" >
                  <div class="expend">
                    <Icon @click="collapse" :class="iconClass" type="md-menu" size="24"></Icon>
                  </div>
                  <Menu ref="menu" :active-name="activeMenu" :open-names="openSubmenu" :accordion="true"  theme="light" width="auto" @on-select="addTab" :class="menuitemClasses" >
                    <template v-if="!isCollapsed">
                      <Submenu  v-for="(sub, i) in menuList" :name="`${i}`" :key="`${i}`" >
                        <template slot="title">
                          <Icon :type="sub.icon" />
                          {{sub.title}} 
                        </template>
                        <MenuItem v-for="(val, n) in sub.sub" :name="`${val.title}-${val.url}`" :key="`${i}-${n}`" >
                          {{val.title}}
                        </MenuItem>
                      </Submenu>
                    </template>
                    <template v-if="isCollapsed">
                      <!-- 菜单收起状态 -->
                      <Dropdown  v-for="(sub, i) in menuList" :key="`${i}`"  placement="right-start" class="menu-dropdown">
                        <MenuItem :name="sub.title" >
                          <Icon :type="sub.icon" />
                        </MenuItem>
                        <DropdownMenu slot="list">
                            <DropdownItem  style="padding: 0 0; ">
                              <MenuItem v-for="(val, n) in sub.sub" :name="`${val.title}-${val.url}`" :key="`${i}-${n}`">
                                {{val.title}}
                              </MenuItem>
                            </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>

                      
                    </template>
                  </Menu>
                </Sider>
                <Layout>
                  <Content>
                    <div class="tab-header">
                      <Tabs type="card" :value="nowTab" :closable="tabList.length > 1" @on-click="chooseTab" @on-tab-remove="closeTab">
                          <TabPane v-for="val in tabList" :key="val.url" :label="val.title" :name="val.url" ></TabPane>
                      </Tabs>
                    </div>
                    <div class="tab-con" ref="content" :style="`height: ${wrapperHeight}px`">
                        <keep-alive :include="include" >
                            <!--需给每个组件添加name属性 -->
                            <router-view  ref="view"  ></router-view>
                        </keep-alive>
                    </div>
                  </Content>
                </Layout>
                
            </Layout>
        </Layout>
    </section>
</template>
<script>

export default {
    data() {
      return {
        menuList: [
          {
            title: '内容管理',
            icon: 'ios-paper',
            sub: [
              {
                title: '关于',
                url: 'about'
              },
              {
                title: 'page1',
                url: 'page1'
              }
            ]
          },
          {
            title: '页面管理',
            icon: 'ios-paper',
            sub: [
              {
                title: 'page2',
                url: 'page2'
              }
            ]
          }
        ],
        tabList: [],
        nowTab: '',
        activeMenu: '',
        openSubmenu: [],
        wrapperHeight: 0,
        isCollapsed: false
      };
    },
    computed:{
      include(){ // keep-alive 缓存数组
        let arr = []
        this.tabList.map(val => {
          arr.push(val.url)
        })
        return arr
      },
      menuitemClasses () {
          return [
            'menu-item',
            this.isCollapsed ? 'collapsed-menu' : ''
          ]
      },
      iconClass(){
        return this.isCollapsed ? 'rotate' : '' 
      }
    },
    created() { 
        

    },
    mounted(){
      let path = this.$route.path.substr(1)
      this.initTab(path,true)
      this.$nextTick(() => {
        this.setContentHeight()
      })
    },
    watch:{
      $route: {  // url改变时选中tab
        handler: function(to){
          let path = to.path.substr(1)
          this.nowTab = path
        },
        deep: true
      }
    },   
    methods: {
      collapse(){
        this.$refs.side.toggleCollapse()
        this.$nextTick(() => { // 动态改变menu选中状态
          this.$refs.menu.updateOpened()
          this.$refs.menu.updateActiveName()
        })
      },
      initTab(path,flag){ // 用于默认选中菜单与tab
        //let path = this.$route.path.substr(1)
        let len = this.menuList.length
        this.nowTab = path
        for(let i=0; i<len; i++ ){
          for(let item of this.menuList[i].sub){
            if(path === item.url){
              this.openSubmenu = [`${i}`]
              this.activeMenu = `${item.title}-${item.url}`
              this.$nextTick(() => { // 动态改变menu选中状态
                this.$refs.menu.updateOpened()
                this.$refs.menu.updateActiveName()
              })
              if(flag){
                this.tabList.push({
                  title: item.title,
                  url: item.url
                })
              }
              return
            }
          }
        }
      },
      chooseTab(name){
        this.$router.push({
          path: name
        })
        this.initTab(name)
      },
      addTab(name){
        let obj = {
          title: name.split('-')[0],
          url: name.split('-')[1]
        }
        console.log(obj)
        if(!obj.url){
          console.log('空菜单')
          return
        }

        if(this.checkHasTab(obj.url) === -1){
          this.tabList.push(obj)
        }

        
        this.$router.push({
          path: obj.url
        })
        this.nowTab = obj.url
        
      },
      checkHasTab(url){
        let flag = this.tabList.findIndex(val => {
          return val.url === url
        })
        return flag
      },
      setContentHeight(){
        this.wrapperHeight = window.innerHeight - this.$refs.content.getBoundingClientRect().top;
      },
      closeTab(name){
        let index = this.tabList.findIndex(val => val.url === name)
        if(index !== -1){
          //this.tabMap.splice(index,1)
          this.removeTab(index)
        }
      },
      removeTab(i){
        if(this.tabList.length === 1){
          return
        }
        let path = this.$route.path.substr(1)
        if(this.tabList[i].url === path){
          this.tabList.splice(i,1)
          this.nowTab = this.tabList[this.tabList.length - 1].url
          this.$router.push(this.nowTab)
          // Todo  自动选中菜单
          this.initTab(this.nowTab)
        }else{
          this.tabList.splice(i,1)
        }

        

      }
    }
}
</script>
<style lang="scss">
    .page-home{
        position: relative;
        height: 100vh;
        overflow: hidden;
        .ivu-layout-header{
          height: 64px;
        }
        .header{
          color: #fff;
        }
        .menu-item span{
            display: inline-block;
            overflow: hidden;
            //width: 69px;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition: width .2s ease .2s;
        }
        .menu-item i{
            transform: translateX(0px);
            transition: font-size .2s ease, transform .2s ease;
            vertical-align: middle;
            font-size: 16px;
        }
        .collapsed-menu span{
            width: 0px;
            transition: width .2s ease ;
        }
        .collapsed-menu i{
            transform: translateX(5px);
            transition: font-size .2s ease .2s, transform .2s ease .2s;
            vertical-align: middle;
            font-size: 22px;
        }
        .ivu-layout-sider{
          height: calc(100vh - 64px);
          .ivu-menu-vertical.ivu-menu-light:after{
            background: none;
          }
          .expend{
            padding: 10px 20px;
            .rotate{
              transform: rotate(90deg);
              transition: transform .3s;
            }
          }
          .ivu-menu{
            width: 200px;
          }
          .ivu-menu-submenu-title,.ivu-menu-item{
            white-space: nowrap;
            //width: 200px;
          }
          .ivu-dropdown{
            display: block;
          }
        }
        .layout-nav{
            width: 420px;
            margin: 0 auto;
            margin-right: 20px;
        }
        .tab-header{
          height: 50px;
          padding: 5px;
        }
        .tab-con{
          padding: 0 20px;
          flex: auto;
        }
    }
</style>


