import { reactive, ref, onMounted } from "vue"
import { email, required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useUserStore } from "./../userStore"
import { useRouter } from "vue-router"

export default function useNewUser() {
  const store = useUserStore()
  const router = useRouter()
  const isLoading = ref(false)
  const state = reactive({
    name: "",
    email: "",
    age: "",
    phoneNumber: "",
    gender: "",
    birthDate: "",
  })

  const rules = {
    name: { required },
    email: { required, email },
    age: { required },
    phoneNumber: { required },
    gender: { required },
    birthDate: { required },
  }

  const submitted = ref(false)

  const v$ = useVuelidate(rules, state)

  onMounted(() => {})

  const handleSubmit = (isFormValid) => {
    submitted.value = true

    if (!isFormValid) {
      return
    }

    addUser()
  }
  const addUser = async () => {
    isLoading.value = true

    await store.add({
      name: state.name,
      email: state.email,
      age: state.age,
      phoneNumber: state.phoneNumber,
      gender: state.gender,
      birthDate: state.birthDate,
    })

    const response = store.addResponse

    if (response) {
      router.push({ name: "userList" })
    }

    isLoading.value = false
  }

  return {
    isLoading,
    state,
    v$,
    handleSubmit,
    submitted,
  }
}
