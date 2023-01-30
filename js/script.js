$(document).ready(function () {

    if (typeof select_script === 'undefined')
        $('select').niceSelect();

    $('section .video .content a').each(function () {
        $(this).hide();
    });

    $('section .video .favourite').each(function () {
        $(this).hide();
    });

    $('section .video .block').each(function () {
        $(this).hide();
    });

    $(".video").hover(function () {
        $(this).children("video")[0].play();
        $(this).children().eq(4).children().eq(2).show();
        $(this).children().eq(0).show();
        $(this).children().eq(1).show();
    }, function () {
        let el = $(this).children("video")[0];
        el.currentTime = 0;
        el.pause();
        $(this).children().eq(2).css('opacity', '1');
        $(this).children().eq(4).children().eq(2).hide();
        $(this).children().eq(0).hide();
        $(this).children().eq(1).hide();
    });

    let videos_condition = true;
    $(".video").click(function () {
        $(this).children().eq(2).css('opacity', '0');
        if (videos_condition) {
            $('video').each(function () {
                $(this).prop('muted', false);
            });
            videos_condition = false;
        }
    });
    if (videos_condition) {
        $(window).click(function (e) {
            $('video').each(function () {
                $(this).prop('muted', false);
            });
        });
        videos_condition = false;
    }

    show_up = function () {
        if ($(window).scrollTop() >= $(window).height()) {
            $(".up").css("display", "flex");
        } else {
            $(".up").css("display", "none");
        }
    };
    show_up();

    $(window).scroll(function () {
        show_up();
    });

    $(".up").click(function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    let filters_data = {
        country: [],
        industry: [],
        objective: [],
        sort_by: "",
        duration: [],
        interval: "",
        interactive_filters: "",
        from: "",
        to: "",
        text: ""
    };

    $(".nice-select li.option").click(function () {
        if ($(this).parent().parent().prev().prop("id") != "interval" && $(this).parent().parent().prev().prop("id") != "sort_by") {
            if (!$(this).hasClass("disabled")) {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
            }
        } else {
            if (!$(this).hasClass("disabled")) {
                $(this).parent().children("li").each(function () {
                    $(this).removeClass("active");
                });
                $(this).addClass("active");
            }
        }
        searchHandler();
    });

    $(".top-filters span button").click(function () {
        if ($(this).hasClass("active"))
            $(this).removeClass("active");
        else {
            $(".top-filters span button").each(function () {
                $(this).removeClass("active");
            });
            $(this).addClass("active");
        }
        searchHandler();
    });

    $(".nice-select .option.disabled").click(function () {
        $(this).parent().children("li").each(function () {
            $(this).removeClass("active");
        });
        searchHandler();
    });

    $(".filters .type_2").change(function () {
        searchHandler();
    });

    $("#text").keyup(function () {
        if ($(this).val().trim().length > 0)
            filters_data.text = $("#text").val();
        else
            filters_data.text = "";
        searchHandler();
    });

    let type_1 = 0;
    searchHandler = function () {
        filters_data = {
            country: [],
            industry: [],
            objective: [],
            sort_by: "",
            duration: [],
            interval: "",
            interactive_filters: "",
            from: "",
            to: ""
        }, type_1 = 0;

        $(".nice-select ul").each(function () {
            $(this).children(".option").each(function () {
                if ($(this).hasClass("active")) {
                    if (!$(this).parent().parent().parent().hasClass("interval"))
                        filters_data[Object.keys(filters_data)[type_1]] = [...filters_data[Object.keys(filters_data)[type_1]], $(this).attr("data-value")];
                    else
                        filters_data[Object.keys(filters_data)[type_1]] = $(this).attr("data-value");
                }
            });
            type_1++;
        });

        filters_data.from = $("#from").val();
        filters_data.to = $("#to").val();

        if ($("#text").val().trim().length > 0)
            filters_data.text = $("#text").val();
        else
            filters_data.text = "";

        $(".top-filters span").each(function () {
            if ($(this).children().eq(0).prop("class") == "active")
                filters_data.interactive_filters = $(this).children().eq(0).children().eq(0).html();
        });
        prepareForm();
    };

    deleteElement = function (x, y, type) {
        let current_filter = Object.keys(filters_data)[x];
        if (current_filter == "from" || current_filter == "to" || current_filter == "text") {
            $("#" + current_filter).val("");
        } else if (current_filter == "interactive_filters") {
            $(".top-filters span b").each(function () {
                if ($(this).html() == filters_data[Object.keys(filters_data)[x]])
                    $(this).parent().removeClass("active");
            });
        } else {
            $("#" + current_filter).next().children().eq(1).children("li").each(function () {
                if ($(this).attr("data-value") == filters_data[Object.keys(filters_data)[x]][y])
                    $(this).removeClass("active");
            });
        }
        searchHandler();
    };

    let filters_condition = false;
    prepareForm = function () {
        filters_condition = true;
        let temp = ``;
        for (let i = 0; i < Object.keys(filters_data).length; i++) {
            if (filters_data[Object.keys(filters_data)[i]].length > 0) {
                if (typeof filters_data[Object.keys(filters_data)[i]] == "string")
                    temp += `
                    <div class="selected__filter">
                        <label>${Object.keys(filters_data)[i]}</label>   
                        <span class="mx-1" onClick="deleteElement(${i},${0},1)">${filters_data[Object.keys(filters_data)[i]]}</span>
                    </div>
                    `;
                else {
                    let data = ``;
                    for (let j = 0; j < filters_data[Object.keys(filters_data)[i]].length; j++) {
                        data += `
                        <span class="mx-1" onClick="deleteElement(${i},${j},2)">${filters_data[Object.keys(filters_data)[i]][j]}</span>
                        `;
                    }
                    temp += `
                    <div class="selected__filter">
                        <label>${Object.keys(filters_data)[i]}</label>   
                        <div class="d-flex">${data}</div>
                    </div>
                    `;
                }
            }
        }
        $(".our__filters").html(temp);
        if ($('.our__filters').children().length > 0) {
            $("#apply_filters").css("display", "inline-block");
            $('.our__filters').css("padding", "1rem 0");
        } else {
            $('.our__filters').css("padding", "0");
            $("#apply_filters").css("display", "none");
        }
        // const myJSON = JSON.stringify(filters_data);
        // $("#form_input").val(myJSON);
        $("#form_input").val(filters_data);
        //console.log(filters_data);
    };

    $("#apply_filters").click(function () {
        prepareForm();
        document.myForm.submit();
    })

    $("#add_new").click(function () {
        $(".add-new").css("display", "none");
        $(".new_keyword").css("display", "block");
    })

    $(".new_keyword #exit").click(function () {
        $(this).parent().css("display", "none");
        $(".add-new").css("display", "block");
    })
});
