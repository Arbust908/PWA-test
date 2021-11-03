<template>
    <form method="POST" action="/" class="p-4 flex flex-col gap-4">
        <div class="flex flex-col">
            <div class="overflow-x-auto">
                <div class="align-middle inline-block min-w-full">
                    <div class="overflow-hidden">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead>
                                <slot name="head"> Head </slot>
                            </thead>
                            <tbody class="divide-y">
                                <slot name="body"> Body </slot>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>
