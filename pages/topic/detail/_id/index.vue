<template>
  <div :class="$style['topic-detail']">
    <el-row :gutter="20">
      <el-col :span="17">
        <topic-detail-header
          :topicDataInfo="topicDataInfo"
          :informationStatisticsData="informationStatisticsData"
        />
        <tabs
          :topicDataInfo="topicDataInfo"
          :topicPeriodicalsDataList="topicPeriodicalsDataList"
          :topicQuestionsDataList="topicQuestionsDataList"
          @perimore="perimore"
          @quesmore="quesmore"
        />
      </el-col>
      <el-col :span="7">
        <side
          :popularList="popularList"
          :topicsList="topicsList"
          :advertisementData="advertisementData"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import topicDetailHeader from '~/components/topic/detail/detail-header'
import tabs from '~/components/topic/detail/tabs/index'
import side from '~/components/topic/detail/side/index'
export default {
  components: {
    tabs,
    topicDetailHeader,
    side
  },
  data() {
    return {
      perimorePage: 2,
      quesmorePage: 2,
      perimoreisLoading: false,
      quesmoreLoading: false
    }
  },
  async asyncData({ $axios, params }) {
    const topicDataPromise = $axios({
      method: 'get',
      url: `/api/topics/${params.id}`,
      params: {
        fields: 'introduction;moreInformation'
      }
    }).catch(() => Promise.resolve({ data: {} }))

    const topicPeriodicalsPromise = $axios({
      method: 'get',
      url: `/api/topics/${params.id}/periodicals`,
      params: {
        page: 1,
        per_page: 5
      }
    }).catch(() => Promise.resolve({ data: [] }))

    const topicQuestionsPromise = $axios({
      method: 'get',
      url: `/api/topics/${params.id}/questions`,
      params: {
        page: 1,
        per_page: 10
      }
    }).catch(() => Promise.resolve({ data: [] }))

    const informationStatisticsPromise = $axios({
      method: 'get',
      url: `/api/topics/${params.id}/information/statistics`
    }).catch(() => Promise.resolve({ data: {} }))

    const popularListPromise = $axios({
      method: 'get',
      url: '/api/periodical',
      params: {
        current: 1,
        size: 5,
        auditStatus: 1,
        popular: true
      }
    }).catch(() => Promise.resolve({ data: { data: [] } }))

    const topicsListPromise = $axios({
      method: 'get',
      url: '/api/topics',
      params: {
        page: 1,
        per_page: 18,
        popular: true
      }
    }).catch(() => Promise.resolve({ data: [] }))

    const advertisementListPromise = $axios({
      method: 'get',
      url: '/api/advertisement',
      params: {
        page: 1,
        per_page: 1
      }
    }).catch(() => Promise.resolve({ data: [] }))

    const apiData = await new Promise((resolve) => {
      Promise.all([
        topicDataPromise,
        topicPeriodicalsPromise,
        topicQuestionsPromise,
        informationStatisticsPromise,
        popularListPromise,
        topicsListPromise,
        advertisementListPromise
      ]).then((dataGather) => {
        resolve({
          topicDataInfo: dataGather[0].data,
          topicPeriodicalsDataList: dataGather[1].data,
          topicQuestionsDataList: dataGather[2].data,
          informationStatisticsData: dataGather[3].data,
          popularList: dataGather[4].data.data,
          topicsList: dataGather[5].data,
          advertisementData: dataGather[6].data[0]
        })
      })
    })
    return apiData
  },
  methods: {
    async perimore() {
      const { params } = this.$route
      if (this.perimoreisLoading === false) {
        this.perimoreisLoading = true
        const res = await this.$axios({
          method: 'get',
          url: `/api/topics/${params.id}/periodicals`,
          params: {
            page: this.perimorePage,
            per_page: 5
          }
        })
        this.perimorePage = this.perimorePage + 1
        if (res.data.length) {
          if (res.data.length === 5) {
            this.perimoreisLoading = false
          }
          this.topicPeriodicalsDataList = this.topicPeriodicalsDataList.concat(
            res.data
          )
        } else {
          this.$message('我是有底线的！')
        }
      } else {
        this.$message('我是有底线的！')
      }
    },
    async quesmore() {
      const { params } = this.$route
      if (this.quesmoreLoading === false) {
        this.quesmoreLoading = true
        const res = await this.$axios({
          method: 'get',
          url: `/api/topics/${params.id}/questions`,
          params: {
            page: this.quesmorePage,
            per_page: 5
          }
        })
        this.quesmorePage = this.quesmorePage + 1
        if (res.data.length) {
          if (res.data.length === 5) {
            this.quesmoreLoading = false
          }
          this.topicQuestionsDataList = this.topicQuestionsDataList.concat(
            res.data
          )
        } else {
          this.$message('我是有底线的！')
        }
      } else {
        this.$message('我是有底线的！')
      }
    }
  },
  head() {
    return {
      title: this.topicDataInfo.name || '话题详情',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `hi，我是UOOOOOOOO网站的作者杨盼，您正在查看话题 - ${this.topicDataInfo.name}`
        }
      ]
    }
  }
}
</script>

<style lang="scss" module>
.topic-detail {
  width: 1024px;
  margin: 0 auto;
  padding: 20px 0;
}
</style>
