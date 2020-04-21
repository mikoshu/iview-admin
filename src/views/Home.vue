<template>
    <section class="page-home">
        <Layout>
            <Header>Header</Header>
            <Layout>
                <Sider hide-trigger :style="{background: '#fff'}">
                  <Menu ref="menu" :active-name="activeMenu" :open-names="openSubmenu" :accordion="true"  theme="light" width="auto" @on-select="addTab" >
                      <Submenu v-for="(sub, i) in menuList" :name="`${i}`" :key="`${i}`" >
                        <template slot="title">
                          <Icon :type="sub.icon" />
                          {{sub.title}} 
                        </template>
                        <MenuItem v-for="(val, n) in sub.sub" :name="`${val.title}-${val.url}`" :key="`${i}-${n}`" >
                          {{val.title}}
                        </MenuItem>
                      </Submenu>
                  </Menu>
                </Sider>
                <Layout>
                  <Content>
                    <div class="tab-header">
                      <Tabs type="card" :value="nowTab" closable @on-click="chooseTab" @on-tab-remove="closeTab">
                          <TabPane v-for="val in tabList" :key="val.url" :label="val.title" :name="val.url" ></TabPane>
                      </Tabs>
                    </div>
                    <div class="tab-con" ref="content" :style="`height: ${wrapperHeight}px`">
                        <keep-alive :include="menu_include" :exclude="menu_exclude" >
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
        menu_include: [],
        menu_exclude: [],
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
        wrapperHeight: 0
      };
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
      initTab(path,flag){
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
      },
      addTab(name){
        let obj = {
          title: name.split('-')[0],
          url: name.split('-')[1]
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
        console.log(i)
        
        if(this.tabList.length === 1){
          return
        }
        
        let path = this.$route.path.substr(1)
        console.log(this.tabList[i].url, path)
        if(this.tabList[i].url === path){
          this.tabList.splice(i,1)
          this.nowTab = this.tabList[this.tabList.length - 1].url
          console.log(this.nowTab)
          this.$router.push(this.nowTab)
          // Todo  自动选中菜单
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
        .ivu-layout-sider{
          height: calc(100vh - 64px);
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
          flex: auto;
        }
    }
</style>


