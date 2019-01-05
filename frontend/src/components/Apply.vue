<template>
    <section id="form" class="container">
        <form @submit.prevent="processForm">

            <label for="" class="label">Start Date</label>
            <date-picker v-model="leave_data.startDate" lang="en" format="DD/MM/YYYY" name="startDate" placeholder="Start Date" width="100%" class="date"></date-picker>

            <label for="" class="label">End Date</label>
            <date-picker v-model="leave_data.endDate" lang="en" format="DD/MM/YYYY" placeholder="End Date" width="100%" class="date"></date-picker>

            <div class="field">
                <label class="label" for="totalDays">Total Days</label>
                <div class="control">
                    <input class="input" required type="number" v-model="leave_data.totalDays" placeholder="Number of Days">
                </div>
            </div>

            <div class="field">
                <label class="label" for="reason">Reason for Leave</label>
                <div class="control">
                    <textarea class="textarea" required type="text" v-model="leave_data.reason" placeholder="Type in your reason for leave" />
                </div>
            </div>

            <div class="field">
                <label class="label" for="nature">Nature of Leave</label>
                <div class="control">
                    <input class="input" type="text" required v-model="leave_data.nature" placeholder="Type in your nature of leave">
                </div>
                <p class="help is-danger"> {{ error }} </p>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-info is-fullwidth" type="submit" >Submit</button>
                </div>
            </div>
            {{ leave_data.startDate }}
        </form>
    </section>
</template>

<script>
import DatePicker from 'vue2-datepicker'

export default {
    name: "Apply",
    components: {
        DatePicker
    },
    data() {
        return {
            leave_data : {
                startDate: '',
                endDate: '',
                totalDays: undefined,
                reason: '',
                nature: ''
            },
            error: ''
        }
    },
    methods: {
        processForm() {
            if(this.leave_data.startDate.length === 0 || this.leave_data.endDate.length === 0) {
                this.error = "All fields are required"
                setTimeout(() => {
                    this.error = ""
                }, 4000)
            } else {
                // Do the API Call to save this into DB
                console.log(this.leave_data)
            }
        }
    }
}
</script>

<style scoped>
.container {
    width: 40%;
    margin: 0 auto;
}

#form {
    padding-top: 2rem;
}

.date {
    padding-top: 0.25rem;
    padding-bottom: 1rem;
}

</style>
