<template>
  <a-form
      :model="formState"
      :rules="rules"
  >
    <a-form-item required has-feedback label="Password" name="pass">
      <a-input v-model:value="formState.pass" type="password" />
    </a-form-item>
    <a-form-item has-feedback label="Confirm" name="checkPass">
      <a-input v-model:value="formState.checkPass" type="password" />
    </a-form-item>
    <a-form-item has-feedback label="Age" name="age">
      <a-input v-model:value="formState.age" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Reset</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { defineComponent, reactive, ref, UnwrapRef } from 'vue';
interface FormState {
  pass: string;
  checkPass: string;
  age: number | undefined;
}

export default {
  name: "About",
  setup() {
    const formRef = ref();
    const formState: UnwrapRef<FormState> = reactive({
      pass: '',
      checkPass: '',
      age: undefined,
    });
    let checkAge = async (rule: RuleObject, value: number) => {
      if (!Number.isInteger(value)) {
        return Promise.reject('Please input digits');
      } else {
        return Promise.resolve();
      }
    };
    let validatePass = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateField('checkPass');
        }
        return Promise.resolve();
      }
    };
    let validatePass2 = async (rule: RuleObject, value: string) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };
    const rules = {
      pass: [{ validator: validatePass, trigger: 'change' }],
      checkPass: [{ validator: validatePass2, trigger: 'change' }],
      age: [{ validator: checkAge, trigger: 'change' }]
    };
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const handleFinish = (values: FormState) => {
      console.log(values, formState);
    };
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log(errors);
    };
    const resetForm = () => {
      formRef.value.resetFields();
    };

    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
    }
  }
}
</script>

<style scoped lang="less">

</style>
