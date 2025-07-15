export const titleOptions = {
    required: "Поле не должно быть пустым",
    minLength: { value: 5, message: "Слишком короткое название" },
    maxLength: { value: 100, message: "Слишком длинное название" },
}

export const contentOptions = {
    required: "Поле не должно быть пустым",
    maxLength: { value: 10000, message: "Слишком большой файл" }
}

export const keyOptions = {
    maxLength: { value: 20, message: "Слишком длинный пароль" }
}