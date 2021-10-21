<template>
    <section>
        <div>
            <div>
                <article>
                    <table>
                        <thead>
                            <slot name="header">
                                <tr>
                                    <th scope="col">Header</th>
                                </tr>
                            </slot>
                        </thead>
                        <tbody>
                            <slot name="body">
                                <tr>
                                    <td>Body</td>
                                </tr>
                            </slot>
                        </tbody>
                    </table>
                </article>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    section {
        @apply flex flex-col;
        & > div {
            @apply overflow-x-auto;
            & > div {
                @apply align-middle inline-block min-w-full;
                & > article {
                    @apply shadow overflow-hidden border-b border-second-200 sm:rounded-lg;
                }
            }
        }
    }
    table {
        @apply min-w-full divide-y divide-second-200;
        thead {
            @apply bg-second-50;
        }
    }
</style>
