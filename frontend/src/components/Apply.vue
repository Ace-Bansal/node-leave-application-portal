<template>
    <section id="form" class="container">
        <form @submit.prevent="processForm">
            <div class="field">
                <label class="label" for="startDate">From</label>
                <div class="control">
                    <input class="input" type="text" v-model="startDate" placeholder="Start Date of Leave">
                </div>
            </div>

            <div class="field">
                <label class="label" for="enddate">To</label>
                <div class="control">
                    <input class="input" type="date" v-model="endDate">
                </div>
            </div>

            <div class="field">
                <label class="label" for="totalDays">Total Days</label>
                <div class="control">
                    <input class="input" type="number" v-model="totalDays" placeholder="Number of Days">
                </div>
            </div>

            <div class="field">
                <label class="label" for="reason">Reason for Leave</label>
                <div class="control">
                    <textarea class="textarea" type="text" v-model="reason" placeholder="Type in your reason for leave" />
                </div>
            </div>

            <div class="field">
                <label class="label" for="nature">Nature of Leave</label>
                <div class="control">
                    <input class="input" type="text" v-model="nature" placeholder="Type in your nature of leave">
                </div>
            </div>

            <div class="field">
                <div class="control">
                    <button class="button is-primary is-fullwidth" type="submit" >Submit</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
export default {
    name: "Apply",
    data() {
        return {
            startDate: '',
            endDate: '',
            totalDays: undefined,
            reason: '',
            nature: ''
        }
    },
    methods: {
        processForm() {
            console.log("Submitted")
        }
    }
}
</script>

<style scoped>
.container {
    width: 40%;
    margin: 0 auto;
}
</style>
