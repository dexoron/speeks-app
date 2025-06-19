export default function Register() {
    
    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-2">Создать аккаунт</h1>
            <form className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-white/50">Имя пользователя</label>
                    <input type="text" id="username" name="username" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-white/50">E-Mail</label>
                    <input type="email" id="email" name="email" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-white/50">Пароль</label>
                    <input type="password" id="password" name="password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="2password" className="text-white/50">Повторите пароль</label>
                    <input type="password" id="2password" name="2password" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-white/50">Дата рождения</label>
                    <input type="date" id="date" name="date" required className="w-full h-12 rounded-lg bg-white/10 px-2" />
                </div>
                <button type="submit" className="w-full h-12 bg-black/75 font-semibold rounded-lg hover:bg-black">Продолжить</button>
                <span className="text-white/50">
                Нажав на кнопку “Продолжить”, вы подтверждаете что ознокомились и согласны с
                <a className="text-sky-500" href="#"> Условиями использования</a> и
                <a className="text-sky-500" href="#"> Политиеой конфедициальности</a> Speeksu
                </span>
                <span className="text-white/50 text-right">Уже есть аккаунт? <a className="text-sky-500" href="/auth/login">Войти</a></span>
            </form>
        </>
    );
}
