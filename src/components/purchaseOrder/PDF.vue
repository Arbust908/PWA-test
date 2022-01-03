<template>
    <section>
        {{ info }}
        <header>
            <h2>Orden de pedido {{}}</h2>
            <dl>
                <dt>Cliente</dt>
                <dd>{{}}</dd>
                <dt>Pozo</dt>
                <dd>{{}}</dd>
            </dl>
        </header>
        <main>
            <section>
                <h3>Arena</h3>
                <article>
                    <h4></h4>
                    <dl>
                        <dt>Pedido:</dt>
                        <dd>{{}}</dd>
                    </dl>
                </article>
            </section>
            <section>
                <h3>Transporte</h3>
                <article></article>
            </section>
            <hr />
            <section>
                <h3>Observaciones</h3>
                <dl>
                    <dt>Fecha de entrega:</dt>
                    <dd>{{ info.localDate }}</dd>
                    <dt>Hora de entrega</dt>
                    <dd>{{ new Date(info.localTime) }}</dd>
                </dl>
                <p>Observaciones:{{ info.packageObservations }}</p>
            </section>
        </main>
        <footer>
            <p>Responsable de carga</p>
            <p>Confirma recepción</p>
        </footer>
    </section>
</template>

<script setup lang="ts">
    defineProps({
        info: {
            type: Object,
            required: true,
        },
    });
</script>

<style scoped></style>
