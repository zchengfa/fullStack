<template>
  <div class="reset-password-container">
    <el-card class="reset-card">
      <template #header>
        <div class="card-header">
          <span>重置密码</span>
        </div>
      </template>

      <el-form
          ref="resetFormRef"
          :model="resetForm"
          :rules="resetRules"
          label-width="100px"
          class="reset-form"
      >
        <el-form-item label="账号" prop="account">
          <el-input
              v-model="resetForm.account"
              placeholder="请输入您的账号"
          />
        </el-form-item>

<!--        <el-form-item label="验证码" prop="code">-->
<!--          <el-input-->
<!--              v-model="resetForm.code"-->
<!--              placeholder="请输入验证码"-->
<!--              style="width: 70%"-->
<!--          />-->
<!--          <el-button-->
<!--              type="primary"-->
<!--              :disabled="isSending || countdown > 0"-->
<!--              @click="sendVerifyCode"-->
<!--              style="margin-left: 10px; width: 28%"-->
<!--          >-->
<!--            {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}-->
<!--          </el-button>-->
<!--        </el-form-item>-->

        <el-form-item label="新密码" prop="newPassword">
          <el-input
              v-model="resetForm.newPassword"
              type="password"
              placeholder="请输入新密码"
              show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
              v-model="resetForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="submitReset"
              :loading="isSubmitting"
              style="width: 100%"
          >
            重置密码
          </el-button>
        </el-form-item>

        <div class="back-login">
          <el-link type="primary" @click="backToLogin">返回登录</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { encrypt } from "../common/crypt";
import { defineComponent, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { sendVerificationCode, resetPassword } from '@/network/request'


export default defineComponent({
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const resetFormRef = ref()

    const resetForm = reactive({
      account: '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    })

    const isSending = ref(false)
    const isSubmitting = ref(false)
    const countdown = ref(0)

    // 验证两次密码是否一致
    const validateConfirmPassword = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== resetForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }

    // 验证密码强度
    const validatePassword = (rule: any, value: any, callback: any) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
        callback(new Error('密码必须包含大小写字母和数字'))
      } else {
        callback()
      }
    }

    const resetRules = {
      account: [
        { required: true, message: '请输入账号', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, validator: validatePassword, trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, validator: validateConfirmPassword, trigger: 'blur' }
      ]
    }

    // 发送验证码
    const sendVerifyCode = async () => {
      if (!resetForm.account) {
        ElMessage.error('请先输入账号')
        return
      }

      try {
        isSending.value = true
        await sendVerificationCode(resetForm.account)

        ElMessage.success('验证码已发送，请查收')

        // 开始倒计时
        countdown.value = 60
        const timer = setInterval(() => {
          countdown.value--
          if (countdown.value <= 0) {
            clearInterval(timer)
          }
        }, 1000)

      } catch (error) {
        ElMessage.error('发送验证码失败，请稍后重试')
      } finally {
        isSending.value = false
      }
    }

    // 提交重置密码
    const submitReset = async () => {
      if (!resetFormRef.value) return

      try {
        // 先验证表单
        await resetFormRef.value.validate()

        // 显示加载状态
        isSubmitting.value = true

        // 调用重置密码API
        const response = await resetPassword({
          account: resetForm.account,
          newPassword: encrypt(resetForm.newPassword)
        })

        // 检查响应是否成功
        if (response.data && response.data.success) {
          ElMessage.success('密码重置成功，请使用新密码登录')

          // 只有在成功的情况下才跳转到登录页
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        } else {
          // 如果响应不成功，显示错误信息
          ElMessage.error(response.data?.message || '密码重置失败，请检查输入信息')
        }
      } catch (error) {
        // 捕获错误并显示错误信息
        ElMessage.error('密码重置失败，请检查输入信息或稍后重试')
      } finally {
        // 无论成功与否，都关闭加载状态
        isSubmitting.value = false
      }
    }


    // 返回登录页
    const backToLogin = () => {
      router.push('/login')
    }

    return {
      resetFormRef,
      resetForm,
      resetRules,
      isSending,
      isSubmitting,
      countdown,
      //sendVerifyCode,
      submitReset,
      backToLogin
    }
  }
})
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.reset-card {
  width: 450px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.reset-form {
  padding: 0 20px;
}

.back-login {
  text-align: center;
  margin-top: 10px;
}
</style>
